# GoSleep Push Worker

Der Worker speichert pro Browser eine Web-Push-Anmeldung in einem eigenen Durable Object und plant den nächsten Wecktermin über einen Durable-Object-Alarm. Dadurch kann die Benachrichtigung auch bei geschlossener GoSleep-App zugestellt werden.

## Bereitstellung

1. Abhängigkeiten installieren: `npm install`
2. Bei Cloudflare anmelden: `npx wrangler login`
3. VAPID-Schlüsselpaar erzeugen: `npx web-push generate-vapid-keys`
4. Öffentlichen und privaten Schlüssel als Secrets setzen:
   - `npx wrangler secret put VAPID_PUBLIC_KEY`
   - `npx wrangler secret put VAPID_PRIVATE_KEY`
5. Worker deployen: `npm run deploy`
6. Die ausgegebene Worker-URL in `../push-config.js` eintragen.

Der private VAPID-Schlüssel darf niemals in Git oder in `push-config.js` gespeichert werden.
