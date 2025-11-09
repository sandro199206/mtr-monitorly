# MTR Monitoring Web App 🌐

Eine moderne Web-Anwendung zur Überwachung und Analyse von Netzwerk-Traces mit MTR (My Traceroute). Visualisiert Latenz, Paketverlust und Netzwerk-Hops in einer benutzerfreundlichen Oberfläche.

## ✨ Features

- 🔍 **MTR Trace Ausführung** von verschiedenen Server-Standorten
- 📊 **Interaktive Latenz-Charts** mit Recharts
- 📈 **Detaillierte Hop-Analyse** mit Paketlust-Statistiken
- 🎨 **Modernes UI** mit shadcn/ui und Tailwind CSS
- 🔒 **TypeScript** für Type-Safety
- 🚀 **Optimierte Performance** mit React.memo und useMemo
- ♿ **Accessibility-Features** (ARIA-Labels, Semantic HTML)
- 🐳 **Docker-Ready** für einfaches Deployment
- 🛡️ **Error Boundaries** für robuste Fehlerbehandlung
- ✅ **Input-Validierung** für Hostnames und IP-Adressen

## 🏗️ Technologie-Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Sprache:** TypeScript (Strict Mode)
- **UI-Bibliothek:** shadcn/ui
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State Management:** React Query (TanStack Query)
- **Form Handling:** React Hook Form + Zod
- **Routing:** React Router v6

## 📋 Voraussetzungen

- Node.js 20+ und npm
- Docker & Docker Compose (für Container-Deployment)

## 🚀 Schnellstart

### Lokale Entwicklung

```bash
# Repository klonen
git clone <repository-url>
cd mtr-monitorly

# Dependencies installieren
npm install

# Development Server starten
npm run dev

# App öffnet sich auf http://localhost:8080
```

### Production Build

```bash
# Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## 🐳 Docker Deployment

**Schnellstart mit Docker:**

```bash
# Container bauen und starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# App ist unter http://localhost verfügbar
```

**Detaillierte Deployment-Anleitung:** Siehe [DEPLOYMENT.md](./DEPLOYMENT.md)

Die Deployment-Dokumentation enthält:
- Schritt-für-Schritt Server-Setup
- SSL/HTTPS-Konfiguration
- Nginx-Optimierungen
- Monitoring & Logging
- Troubleshooting-Guide
- Backup-Strategien

## 📁 Projektstruktur

```
mtr-monitorly/
├── src/
│   ├── components/          # React-Komponenten
│   │   ├── ErrorBoundary.tsx
│   │   ├── LatencyChart.tsx
│   │   ├── MtrForm.tsx
│   │   └── TraceResults.tsx
│   ├── lib/                 # Utilities & Helpers
│   │   ├── constants.ts     # App-Konstanten
│   │   ├── validation.ts    # Input-Validierung
│   │   ├── mockData.ts      # Mock-Daten für Dev
│   │   ├── queryClient.ts   # React Query Setup
│   │   ├── types.ts         # TypeScript-Typen
│   │   └── utils.ts         # Helper-Funktionen
│   ├── pages/               # Page-Komponenten
│   │   └── Index.tsx
│   ├── App.tsx              # Root-Komponente
│   └── main.tsx             # Entry Point
├── public/                  # Statische Assets
├── Dockerfile               # Docker-Image-Definition
├── docker-compose.yml       # Docker Compose Config
├── nginx.conf               # Nginx-Konfiguration
├── .env.example             # Environment-Variablen Beispiel
└── DEPLOYMENT.md            # Deployment-Guide
```

## ⚙️ Umgebungsvariablen

Erstelle eine `.env`-Datei basierend auf `.env.example`:

```bash
cp .env.example .env
```

Verfügbare Variablen:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Application Configuration
VITE_APP_TITLE=MTR Monitoring
VITE_APP_VERSION=1.0.0
```

## 🧪 Code-Qualität

### Linting

```bash
npm run lint
```

### Build für verschiedene Umgebungen

```bash
# Production Build
npm run build

# Development Build (mit Source Maps)
npm run build:dev
```

## 📊 Code-Verbesserungen

Das Projekt wurde umfassend optimiert:

✅ **TypeScript Strict Mode** aktiviert
✅ **Input-Validierung** mit Regex für Hostnames/IPs
✅ **Error Boundaries** für robuste Fehlerbehandlung
✅ **Performance-Optimierungen** (useMemo, useCallback)
✅ **Accessibility** (ARIA-Labels, semantisches HTML)
✅ **JSDoc-Kommentare** für bessere Dokumentation
✅ **Query Client** als Singleton
✅ **React.StrictMode** für besseres Debugging
✅ **Konstanten ausgelagert** für Wartbarkeit
✅ **Mock-Daten separiert** für klare Struktur

## 🔧 Entwicklung

### Projektrichtlinien

- **TypeScript:** Strikte Typisierung verwenden
- **Komponenten:** Funktionale Komponenten mit Hooks
- **Styling:** Tailwind CSS Utility Classes
- **State:** React Query für Server-State, useState für UI-State
- **Validierung:** Zod-Schemas für Formulare

### Neue Features hinzufügen

1. Komponenten in `src/components/` erstellen
2. Types in `src/lib/types.ts` definieren
3. Konstanten in `src/lib/constants.ts` hinzufügen
4. JSDoc-Kommentare schreiben
5. Error Handling implementieren

## 🚢 Deployment-Optionen

1. **Docker (Empfohlen):** `docker-compose up -d`
2. **Netlify/Vercel:** Git-basiertes Deployment
3. **Manuell:** Build auf Nginx/Apache Server
4. **Lovable:** [Direkt von Lovable deployen](https://lovable.dev/projects/9006dec5-ed96-446f-ab62-2d0a5dda3cd7)

Details siehe [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🐛 Troubleshooting

### Port bereits belegt
```bash
# Port in vite.config.ts ändern oder Docker-Port anpassen
```

### Build-Fehler
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Docker-Probleme
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Lizenz

Dieses Projekt wurde mit [Lovable](https://lovable.dev) erstellt.

## 🤝 Contribution

Contributions sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

---

**Projekt-URL:** https://lovable.dev/projects/9006dec5-ed96-446f-ab62-2d0a5dda3cd7
