# 🌙 GoSleep

Eine benutzerfreundliche Progressive Web App für Schlafaufzeichnung, Wecker, Statistiken und persönliche Schlafnotizen. Alles läuft lokal im Browser – ohne Konto und ohne Backend.

## Features

- 😴 Schlafmodus mit lokaler Aufzeichnung und Qualitätsanzeige
- ⏰ Wecker mit Wochentagen, fünf Tönen, Schlummern und Ausschalten
- 📊 Editierbare Schlafhistorie mit Wochen-/Monatsstatistik
- 📖 Editierbares Schlaftagebuch
- 🌙 Schlafzyklus-Berechnung (Aufstehzeit basierend auf vollständigen Zyklen)
- 📱 Installierbare und offlinefähige PWA
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

> Wichtig: Der Web-Wecker benötigt eine geöffnete Browser-App. Mobile Betriebssysteme können Webseiten im Hintergrund anhalten; GoSleep ersetzt daher keinen systemeigenen Wecker.

---

GoSleep v2.0 • Sleep Better
