import webpush from 'web-push';

const encoder = new TextEncoder();

function json(data, status = 200){
    return new Response(JSON.stringify(data), {
        status,
        headers:{ 'Content-Type':'application/json; charset=utf-8' }
    });
}

function corsHeaders(origin, env){
    const allowed = origin === env.APP_ORIGIN ? origin : env.APP_ORIGIN;
    return {
        'Access-Control-Allow-Origin':allowed,
        'Access-Control-Allow-Methods':'GET, PUT, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':'Content-Type, Authorization',
        'Access-Control-Max-Age':'86400',
        'Vary':'Origin'
    };
}

function withCors(response, origin, env){
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders(origin, env)).forEach(([key, value]) => headers.set(key, value));
    return new Response(response.body, { status:response.status, statusText:response.statusText, headers });
}

async function sha256(value){
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function localParts(timestamp, timezone){
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone:timezone,
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit', hourCycle:'h23'
    });
    const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp))
        .filter(part => part.type !== 'literal')
        .map(part => [part.type, Number(part.value)]));
    return parts;
}

function zonedDateToTimestamp(year, month, day, hour, minute, timezone){
    const target = Date.UTC(year, month - 1, day, hour, minute);
    let guess = target;
    for(let attempt = 0; attempt < 4; attempt += 1){
        const observed = localParts(guess, timezone);
        const observedUtc = Date.UTC(observed.year, observed.month - 1, observed.day, observed.hour, observed.minute);
        const correction = target - observedUtc;
        guess += correction;
        if(correction === 0) break;
    }
    const check = localParts(guess, timezone);
    return check.year === year && check.month === month && check.day === day && check.hour === hour && check.minute === minute
        ? guess
        : null;
}

function nextAlarmTimestamp(alarm, after = Date.now() + 30000){
    if(!alarm?.enabled || !/^([01]\d|2[0-3]):[0-5]\d$/.test(alarm.time) || !Array.isArray(alarm.days) || !alarm.days.length){
        return null;
    }
    const timezone = alarm.timezone || 'Europe/Berlin';
    localParts(after, timezone); // validates the IANA timezone
    const current = localParts(after, timezone);
    const [hour, minute] = alarm.time.split(':').map(Number);

    for(let offset = 0; offset <= 7; offset += 1){
        const calendarDate = new Date(Date.UTC(current.year, current.month - 1, current.day + offset));
        if(!alarm.days.includes(calendarDate.getUTCDay())) continue;
        const candidate = zonedDateToTimestamp(
            calendarDate.getUTCFullYear(),
            calendarDate.getUTCMonth() + 1,
            calendarDate.getUTCDate(),
            hour,
            minute,
            timezone
        );
        if(candidate && candidate > after) return candidate;
    }
    return null;
}

function validSubscription(subscription){
    return Boolean(
        subscription &&
        typeof subscription.endpoint === 'string' &&
        subscription.endpoint.startsWith('https://') &&
        typeof subscription.keys?.p256dh === 'string' &&
        typeof subscription.keys?.auth === 'string'
    );
}

function validAlarm(alarm){
    if(!alarm || typeof alarm.enabled !== 'boolean') return false;
    if(!alarm.enabled) return true;
    if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(alarm.time || '')) return false;
    if(!Array.isArray(alarm.days) || !alarm.days.length || alarm.days.some(day => !Number.isInteger(day) || day < 0 || day > 6)) return false;
    try{
        localParts(Date.now(), alarm.timezone || 'Europe/Berlin');
        return true;
    } catch(error){
        return false;
    }
}

async function sendNotification(env, subscription, test = false){
    webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
    return webpush.sendNotification(subscription, JSON.stringify({
        title:test ? 'GoSleep Test' : 'Guten Morgen',
        body:test ? 'Hintergrund-Benachrichtigungen funktionieren.' : 'Dein GoSleep-Wecker klingelt jetzt.',
        tag:test ? 'gosleep-test' : 'gosleep-alarm',
        url:env.APP_URL
    }), { TTL:300, urgency:'high' });
}

export class AlarmDevice {
    constructor(state, env){
        this.state = state;
        this.env = env;
    }

    async authorize(request, allowCreate = false){
        const header = request.headers.get('Authorization') || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : '';
        if(token.length < 32) return false;
        const suppliedHash = await sha256(token);
        const storedHash = await this.state.storage.get('tokenHash');
        if(!storedHash && allowCreate){
            await this.state.storage.put('tokenHash', suppliedHash);
            return true;
        }
        return storedHash === suppliedHash;
    }

    async fetch(request){
        const url = new URL(request.url);
        const isTest = url.pathname.endsWith('/test');

        if(request.method === 'PUT'){
            if(!await this.authorize(request, true)) return json({ error:'Nicht autorisiert.' }, 401);
            const body = await request.json().catch(() => null);
            if(!validSubscription(body?.subscription) || !validAlarm(body?.alarm)){
                return json({ error:'Ungültige Push- oder Weckerdaten.' }, 400);
            }
            const nextAlarm = nextAlarmTimestamp(body.alarm);
            await this.state.storage.put({ subscription:body.subscription, alarm:body.alarm, nextAlarm });
            if(nextAlarm) await this.state.storage.setAlarm(nextAlarm);
            else await this.state.storage.deleteAlarm();
            return json({ ok:true, nextAlarm });
        }

        if(request.method === 'DELETE'){
            if(!await this.authorize(request)) return json({ error:'Nicht autorisiert.' }, 401);
            await this.state.storage.deleteAlarm();
            await this.state.storage.deleteAll();
            return json({ ok:true });
        }

        if(request.method === 'POST' && isTest){
            if(!await this.authorize(request)) return json({ error:'Nicht autorisiert.' }, 401);
            const subscription = await this.state.storage.get('subscription');
            if(!subscription) return json({ error:'Keine Push-Anmeldung vorhanden.' }, 404);
            try{
                await sendNotification(this.env, subscription, true);
                return json({ ok:true });
            } catch(error){
                if(error?.statusCode === 404 || error?.statusCode === 410){
                    await this.state.storage.deleteAlarm();
                    await this.state.storage.deleteAll();
                }
                return json({ error:'Test-Benachrichtigung konnte nicht zugestellt werden.' }, 502);
            }
        }

        return json({ error:'Methode nicht erlaubt.' }, 405);
    }

    async alarm(){
        const data = await this.state.storage.get(['subscription', 'alarm']);
        if(!data.subscription || !data.alarm?.enabled) return;
        try{
            await sendNotification(this.env, data.subscription, false);
        } catch(error){
            if(error?.statusCode === 404 || error?.statusCode === 410){
                await this.state.storage.deleteAll();
                return;
            }
            await this.state.storage.setAlarm(Date.now() + 60000);
            throw error;
        }
        const nextAlarm = nextAlarmTimestamp(data.alarm, Date.now() + 30000);
        await this.state.storage.put('nextAlarm', nextAlarm);
        if(nextAlarm) await this.state.storage.setAlarm(nextAlarm);
    }
}

export default {
    async fetch(request, env){
        const url = new URL(request.url);
        const origin = request.headers.get('Origin') || '';
        if(origin && origin !== env.APP_ORIGIN) return withCors(json({ error:'Unerlaubter Ursprung.' }, 403), origin, env);

        if(request.method === 'OPTIONS'){
            return new Response(null, { status:204, headers:corsHeaders(origin, env) });
        }

        if(request.method === 'GET' && url.pathname === '/vapid-public-key'){
            return withCors(json({ publicKey:env.VAPID_PUBLIC_KEY || '' }), origin, env);
        }

        const match = url.pathname.match(/^\/api\/devices\/([A-Za-z0-9_-]{16,128})(?:\/test)?$/);
        if(!match) return withCors(json({ error:'Nicht gefunden.' }, 404), origin, env);

        const id = env.ALARM_DEVICE.idFromName(match[1]);
        const response = await env.ALARM_DEVICE.get(id).fetch(request);
        return withCors(response, origin, env);
    }
};
