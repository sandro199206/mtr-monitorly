# MTR Monitoring - Deployment Guide

Dieses Dokument beschreibt die verschiedenen Deployment-Optionen für die MTR Monitoring Anwendung.

## 📋 Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [Docker Deployment (Empfohlen)](#docker-deployment-empfohlen)
3. [Manuelle Deployment](#manuelle-deployment)
4. [Umgebungsvariablen](#umgebungsvariablen)
5. [SSL/HTTPS Setup](#sslhttps-setup)
6. [Monitoring & Logs](#monitoring--logs)
7. [Troubleshooting](#troubleshooting)

---

## Voraussetzungen

### Für Docker Deployment:
- Docker Engine 20.10+
- Docker Compose 2.0+
- Mindestens 512MB RAM
- 1GB freier Speicherplatz

### Für manuelles Deployment:
- Node.js 20+ und npm
- Nginx oder ein anderer Webserver
- Mindestens 512MB RAM

---

## Docker Deployment (Empfohlen)

### Schnellstart

1. **Repository klonen oder Dateien auf den Server kopieren:**
   ```bash
   git clone <your-repo-url>
   cd mtr-monitorly
   ```

2. **Umgebungsvariablen konfigurieren:**
   ```bash
   cp .env.example .env
   # Bearbeite .env mit deinen Einstellungen
   nano .env
   ```

3. **Build und starte die Container:**
   ```bash
   docker-compose up -d
   ```

4. **Überprüfe den Status:**
   ```bash
   docker-compose ps
   docker-compose logs -f frontend
   ```

Die Anwendung ist jetzt unter `http://localhost` oder `http://<server-ip>` erreichbar.

### Docker-Befehle

```bash
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Container neu bauen
docker-compose build --no-cache

# Container neustarten
docker-compose restart

# Status überprüfen
docker-compose ps
```

### Production-Deployment auf einem Server

1. **Server vorbereiten:**
   ```bash
   # Update System
   sudo apt update && sudo apt upgrade -y

   # Docker installieren (Ubuntu/Debian)
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Docker Compose installieren
   sudo apt install docker-compose-plugin -y

   # Benutzer zur Docker-Gruppe hinzufügen
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Projekt auf Server übertragen:**
   ```bash
   # Via Git
   git clone <your-repo-url>

   # Oder via SCP
   scp -r ./mtr-monitorly user@server:/home/user/
   ```

3. **Auf dem Server deployen:**
   ```bash
   cd mtr-monitorly

   # Environment-Datei erstellen
   cp .env.example .env
   nano .env  # Anpassen

   # Container starten
   docker-compose up -d

   # Logs überprüfen
   docker-compose logs -f
   ```

4. **Firewall konfigurieren:**
   ```bash
   # Port 80 (HTTP) öffnen
   sudo ufw allow 80/tcp

   # Port 443 (HTTPS) öffnen
   sudo ufw allow 443/tcp

   # Firewall aktivieren
   sudo ufw enable
   ```

---

## Manuelle Deployment

### Build lokal erstellen:

```bash
# Dependencies installieren
npm install

# Production Build erstellen
npm run build

# Build-Ordner 'dist' wird erstellt
```

### Mit Nginx deployen:

1. **Nginx installieren:**
   ```bash
   sudo apt install nginx -y
   ```

2. **Build-Dateien kopieren:**
   ```bash
   sudo cp -r dist/* /var/www/mtr-monitoring/
   ```

3. **Nginx konfigurieren:**
   ```bash
   sudo nano /etc/nginx/sites-available/mtr-monitoring
   ```

   Füge folgende Konfiguration ein:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       root /var/www/mtr-monitoring;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Site aktivieren:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/mtr-monitoring /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Umgebungsvariablen

Erstelle eine `.env` Datei basierend auf `.env.example`:

```bash
# API Configuration
VITE_API_BASE_URL=http://your-backend-server.com/api

# Application Configuration
VITE_APP_TITLE=MTR Monitoring
VITE_APP_VERSION=1.0.0

# Environment
NODE_ENV=production
```

**Wichtig:** Die `.env` Datei wird nicht in das Docker-Image eingebaut. Umgebungsvariablen werden zur Build-Zeit verwendet.

---

## SSL/HTTPS Setup

### Mit Let's Encrypt (Certbot):

1. **Certbot installieren:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **SSL-Zertifikat erstellen:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-Renewal testen:**
   ```bash
   sudo certbot renew --dry-run
   ```

### Docker mit SSL:

Aktualisiere `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
```

Erstelle `nginx-ssl.conf` mit SSL-Konfiguration.

---

## Monitoring & Logs

### Docker Logs:

```bash
# Alle Logs anzeigen
docker-compose logs

# Nur Frontend-Logs
docker-compose logs frontend

# Logs live verfolgen
docker-compose logs -f

# Letzte 100 Zeilen
docker-compose logs --tail=100
```

### Nginx Logs:

```bash
# Access Logs
docker-compose exec frontend tail -f /var/log/nginx/access.log

# Error Logs
docker-compose exec frontend tail -f /var/log/nginx/error.log
```

### Health Check:

```bash
# Container Health Status
docker-compose ps

# HTTP Health Check
curl http://localhost/health
```

---

## Troubleshooting

### Container startet nicht:

```bash
# Logs überprüfen
docker-compose logs frontend

# Container-Status prüfen
docker-compose ps

# Container neu bauen
docker-compose build --no-cache frontend
docker-compose up -d
```

### Port bereits belegt:

```bash
# Port-Nutzung prüfen
sudo lsof -i :80
sudo lsof -i :443

# Anderen Port in docker-compose.yml verwenden:
ports:
  - "8080:80"
```

### Build-Fehler:

```bash
# Node-Module-Cache löschen
rm -rf node_modules package-lock.json
npm install

# Docker Build-Cache löschen
docker-compose build --no-cache
```

### Verbindungsprobleme:

```bash
# Firewall-Status prüfen
sudo ufw status

# Ports öffnen
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Docker-Netzwerk prüfen
docker network ls
docker network inspect mtr-monitorly_mtr-network
```

### Performance-Probleme:

```bash
# Container-Ressourcen überprüfen
docker stats

# Nginx-Konfiguration optimieren
# - Gzip-Kompression aktivieren (bereits in nginx.conf)
# - Cache-Header konfigurieren (bereits in nginx.conf)
# - Worker-Prozesse anpassen in nginx.conf
```

---

## Update der Anwendung

### Docker Update:

```bash
# Neue Version pullen
git pull

# Container neu bauen und starten
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Logs überprüfen
docker-compose logs -f
```

### Manuelles Update:

```bash
# Neue Version pullen
git pull

# Dependencies aktualisieren
npm install

# Neu bauen
npm run build

# Build kopieren
sudo cp -r dist/* /var/www/mtr-monitoring/

# Nginx neu laden
sudo systemctl reload nginx
```

---

## Backup & Restore

### Konfiguration sichern:

```bash
# Wichtige Dateien sichern
tar -czf mtr-backup-$(date +%Y%m%d).tar.gz \
  .env \
  nginx.conf \
  docker-compose.yml
```

### Container-Daten sichern:

```bash
# Docker-Volumes sichern (wenn vorhanden)
docker-compose down
docker run --rm -v mtr-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/volumes-backup.tar.gz /data
```

---

## Weitere Hinweise

### Backend-Integration:

Wenn du einen MTR-Backend-Service implementierst:

1. Aktiviere den `backend`-Service in `docker-compose.yml`
2. Stelle sicher, dass der Container die erforderlichen Capabilities hat:
   ```yaml
   cap_add:
     - NET_RAW
     - NET_ADMIN
   ```
3. Aktualisiere `VITE_API_BASE_URL` in `.env`

### Skalierung:

Für hohe Last kannst du mehrere Frontend-Container starten:

```bash
docker-compose up -d --scale frontend=3
```

Verwende einen Load Balancer (z.B. Nginx, Traefik) vor den Containern.

---

## Support

Bei Problemen:
1. Überprüfe die Logs: `docker-compose logs`
2. Teste Health-Check: `curl http://localhost/health`
3. Überprüfe Container-Status: `docker-compose ps`

Viel Erfolg beim Deployment! 🚀
