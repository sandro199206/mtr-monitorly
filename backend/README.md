# MTR Monitoring Backend

Node.js/Express backend with SSH integration for remote MTR execution.

## Features

- **JWT Authentication** - Secure user accounts
- **SSH Remote Execution** - Execute MTR on configured servers via SSH
- **Multi-Server Support** - Run traces from multiple locations simultaneously
- **SQLite Database** - Lightweight, persistent storage
- **RESTful API** - Clean, documented endpoints
- **Export Functionality** - CSV and JSON export

## Setup

### Development

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your JWT secret
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Configuration

Create a `.env` file:

```bash
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secret-key-change-in-production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Servers
- `GET /api/servers` - List user's servers
- `POST /api/servers` - Add new server
- `PUT /api/servers/:id` - Update server
- `DELETE /api/servers/:id` - Delete server
- `POST /api/servers/:id/test` - Test SSH connection

### Traces
- `POST /api/traces` - Execute MTR trace
- `GET /api/traces` - Get trace history
- `GET /api/traces/:id` - Get specific trace
- `POST /api/traces/:id/export` - Export trace (CSV/JSON)

## Database Schema

### Users
- id, username, email, password_hash, created_at

### Servers
- id, user_id, name, host, port, username, auth_type, password, private_key, location, is_active

### Trace Results
- id, user_id, server_id, target, hops (JSON), started_at, completed_at, status, error_message

## SSH Server Requirements

Servers must have:
- SSH access (password or key-based)
- MTR installed (`apt install mtr` on Ubuntu/Debian)
- MTR must support JSON output (`mtr --json`)

## Docker

```bash
docker build -t mtr-backend .
docker run -p 3000:3000 -v mtr-data:/app/data mtr-backend
```

## Security Notes

- Always use HTTPS in production
- Change JWT_SECRET to a strong random value
- Store SSH private keys securely
- Use SSH keys instead of passwords where possible
- Implement rate limiting for API endpoints
