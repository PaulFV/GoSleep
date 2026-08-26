# GoSleep

GoSleep ist eine moderne, responsive Schlaf-Web-App mit neon-grünem Halbmond-Branding.

## Funktionen

- Animierter Sternenhimmel
- Neon-grünes Halbmond-Logo und Favicon
- Live-Uhr
- Einschlaf-Timer mit Vollbild-Schlafmodus
- Schlafzyklus-Rechner
- Wochenstatistik
- Traumtagebuch mit lokaler Speicherung
- Responsive Navigation für Desktop und Mobilgeräte

> Hinweis: Die angezeigten Schlafzeiten und Angaben sind Demonstrationswerte und keine medizinische Bewertung.

## Lokal starten

Voraussetzung: eine aktuelle Node.js-/npm-Installation.

```bash
npm install
npm run dev
```

Anschließend die von Vite angezeigte lokale Adresse im Browser öffnen.

## Produktionsversion erstellen

```bash
npm run build
npm run preview
```

Der fertige Build liegt danach im Ordner `dist`.

## Auf GitHub hochladen

1. Neues Repository mit dem Namen `GoSleep` anlegen.
2. Den Inhalt dieses Projektordners in das Repository kopieren.
3. Änderungen committen und pushen.

```bash
git init
git add .
git commit -m "Initial GoSleep release"
git branch -M main
git remote add origin DEINE_REPOSITORY_ADRESSE
git push -u origin main
```

## GitHub Pages

Die Vite-Konfiguration verwendet `base: './'`, damit der erzeugte Build auch aus einem Unterordner geladen werden kann. Für eine Veröffentlichung kann der Inhalt von `dist` über den gewünschten GitHub-Pages-Workflow bereitgestellt werden.

## Struktur

```text
GoSleep/
├── public/
│   └── moon-neon.svg
├── src/
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── LICENSE
├── package.json
├── README.md
└── vite.config.js
```

## Lizenz

MIT
