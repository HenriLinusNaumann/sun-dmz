# sun-dmz · Security-Lab Präsentation

Präsentation des Containerlab-Sicherheitsprojekts **sun-dmz** — ein komplettes
Firmennetz mit DMZ, WireGuard-VPN, IDS und SIEM, virtualisiert in Containern.

Gebaut mit [open-slide](https://open-slide.dev) · 13 Folien · Deutsch.

## Online ansehen

**https://henrilinusnaumann.github.io/sun-dmz/**

## Lokal bearbeiten

```bash
npm install
npm run dev      # Dev-Server mit Hot-Reload auf http://localhost:5173
npm run build    # Statischen Build nach dist/ erzeugen
```

Die Folien leben als React-Komponenten unter `slides/sun-dmz/index.tsx`.

## Deploy

Jeder Push auf `main` baut und veröffentlicht automatisch via
GitHub Actions (`.github/workflows/deploy.yml`).
