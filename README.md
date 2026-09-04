# 🌙 GoSleep

Eine benutzerfreundliche Progressive Web App für Schlafaufzeichnung, Wecker, Statistiken und persönliche Schlafnotizen. Alles läuft lokal im Browser – ohne Konto und ohne Backend.

## Features

- 😴 Schlafmodus mit lokaler Aufzeichnung und Qualitätsanzeige
- ⏰ Wecker mit Wochentagen, fünf Tönen, Schlummern und Ausschalten
- 📊 Editierbare Schlafhistorie mit Wochen-/Monatsstatistik
- 📖 Editierbares Schlaftagebuch
- 🌙 Schlafzyklus-Berechnung (Aufstehzeit basierend auf vollständigen Zyklen)
- 📱 Installierbare und offlinefähige PWA
- 🔔 Optionale Hintergrund-Wecker per Web Push und Cloudflare Worker
- ♿ Zugängliche Dialoge, Formularbeschriftungen und Tastatursteuerung
- 🎨 Neues GoSleep-App-Logo in mehreren Größen

## Nutzung

Die App benötigt keine Abhängigkeiten und keinen Build-Prozess. Für PWA- und Offline-Funktionen muss sie über HTTPS oder einen lokalen Webserver geöffnet werden.

```bash
open index.html
```

## Projektstruktur

```
GoSleep/
├── index.html         # Komplette App (HTML, CSS und JavaScript)
├── manifest.json      # Web-App-Manifest
├── sw.js              # Offline-Cache der PWA
├── icon-source.svg    # Editierbare Vektorversion des App-Logos
├── icons/             # App-Icons von 32 bis 1024 Pixel
└── README.md
```

## App-Icon

Beim Hinzufügen zum Home-Bildschirm (iOS/Android) wird automatisch das
blau-violette Halbmond-Wellen-Icon aus `icons/` verwendet.

> Ohne aktivierte Hintergrund-Benachrichtigungen benötigt der Web-Wecker eine geöffnete Browser-App. Mobile Betriebssysteme können Webseiten im Hintergrund anhalten.

## Hintergrund-Benachrichtigungen auf dem iPhone

Ab iOS 16.4 kann GoSleep auch bei geschlossener App eine Push-Benachrichtigung senden:

1. Die veröffentlichte GoSleep-Seite in Safari öffnen.
2. Über „Teilen“ → „Zum Home-Bildschirm“ installieren.
3. GoSleep vom Home-Bildschirm starten.
4. Unter „Profil“ die Hintergrund-Benachrichtigungen einschalten und die iOS-Abfrage erlauben.
5. Mit „Test-Benachrichtigung senden“ die Verbindung prüfen.

Der eigentliche Weckzeitpunkt wird im Cloudflare Worker gespeichert. Der private Push-Schlüssel liegt nur als Cloudflare-Secret vor und wird nicht an den Browser ausgeliefert.

> Auch Push-Benachrichtigungen sind kein Ersatz für einen sicherheitskritischen oder medizinisch notwendigen Systemwecker.

---

GoSleep v2.0 • Sleep Better
