# 🌙 GoSleep

Eine einfache, dunkle Dashboard-Oberfläche zur Schlafüberwachung – als statische HTML/CSS-Seite umgesetzt.

## Features

- 😴 Anzeige der Schlafqualität mit Fortschrittsbalken
- ⏰ Anzeige des nächsten Weckers
- 📊 Wochen-/Monatsstatistik
- 🌙 Schlafzyklus-Berechnung (Aufstehzeit basierend auf vollständigen Zyklen)
- Responsives Karten-Layout (Grid)
- Dunkles Design mit Akzentfarbe Cyan (#00BCD4)

## Nutzung

Einfach `index.html` im Browser öffnen – keine Abhängigkeiten, kein Build-Prozess nötig.

```bash
open index.html
```

## Projektstruktur

```
GoSleep/
├── index.html        # Komplette App (HTML + CSS + JS inline, inkl. eingebetteter Icons)
├── manifest.json      # Web-App-Manifest fürs Hinzufügen zum Home-Bildschirm
├── icon-source.svg    # Quell-SVG des App-Icons (Neon-Grün-Halbmond)
├── icons/              # Generierte PNG-Icons (512, 192, apple-touch, favicon)
└── README.md
```

## App-Icon

Beim Hinzufügen zum Home-Bildschirm (iOS/Android) wird automatisch das
Neon-Grün-Halbmond-Icon aus `icons/` verwendet.

## Nächste Schritte / Ideen

- Buttons (Schlafen, Wecker, Statistik, Tagebuch, Einstellungen) mit Funktionalität verknüpfen
- Daten dynamisch statt statisch anzeigen (z. B. via LocalStorage oder Backend)
- JavaScript für echte Wecker- und Timer-Logik ergänzen

---

GoSleep v1.0 • Sleep Better
