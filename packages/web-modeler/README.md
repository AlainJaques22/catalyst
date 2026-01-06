# Catalyst BPMN Modeler

Web-based BPMN 2.0 editor for Catalyst with integrated Camunda deployment and Catalyst connector support.

## Features

- **Visual BPMN 2.0 Editing** - Drag-and-drop interface for creating process diagrams
- **Catalyst Connector Integration** - All connector element templates automatically loaded and available
- **Direct Camunda Deployment** - One-click deployment to Camunda 7
- **File Persistence** - BPMN files stored locally in `./bpmn-files/` directory
- **Properties Panel** - Configure connector properties directly in the modeler
- **Keyboard Shortcuts** - Ctrl+S to save, Ctrl+D to deploy
- **File Management** - Create, save, load, delete, and download BPMN files

## Architecture

The modeler is a standalone React application served as a separate Docker container:

```
┌─────────────────────────────────────────┐
│         nginx (Port 80)                 │
│  Routes /modeler/ → modeler:3000        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│    Modeler Service (modeler:3000)       │
│  ┌───────────────────────────────────┐  │
│  │  React Frontend (Vite)            │  │
│  │  - BpmnModeler (@miragon)         │  │
│  │  - FileBrowser                    │  │
│  │  - Properties Panel               │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Express Backend (Node.js)        │  │
│  │  - File API (/api/files)          │  │
│  │  - Template API (/api/templates)  │  │
│  │  - Deploy API (/api/deploy)       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │                    │
         ▼                    ▼
   ┌──────────┐      ┌──────────────┐
   │  BPMN    │      │   Camunda    │
   │  Files   │      │   Engine     │
   └──────────┘      └──────────────┘
```

## Access

The modeler is accessible at:
- **URL**: `http://localhost/modeler/`
- **Navigation**: Click "Camunda Modeler" button in the Catalyst control panel header

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@miragon/camunda-web-modeler v0.1.1** - BPMN modeler component
- **bpmn-js v14.0.0** - Core BPMN rendering engine
- **@phosphor-icons/react** - Icon library
- **react-hot-toast** - Toast notifications
- **axios** - HTTP client

### Backend
- **Node.js 20 (Alpine)** - Runtime
- **Express.js** - Web server
- **axios** - HTTP client for Camunda API
- **glob** - File pattern matching for template discovery
- **FormData** - Multipart uploads for Camunda deployment

### Critical Dependencies
- **min-dash 4.1.1** - MUST be pinned to this exact version for compatibility
- **camunda-bpmn-moddle v7.0.1** - Camunda BPMN extensions

## API Endpoints

### File Operations

#### `GET /api/files`
Returns list of all BPMN files.

**Response:**
```json
{
  "files": [
    {
      "name": "process.bpmn",
      "size": 2048,
      "modified": "2025-01-05T10:30:00Z"
    }
  ]
}
```

#### `GET /api/files/:filename`
Returns content of a specific BPMN file.

**Response:**
```json
{
  "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>..."
}
```

#### `POST /api/files`
Creates or updates a BPMN file.

**Request:**
```json
{
  "name": "my-process.bpmn",
  "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>..."
}
```

**Response:**
```json
{
  "message": "File saved successfully",
  "filename": "my-process.bpmn"
}
```

#### `DELETE /api/files/:filename`
Deletes a BPMN file.

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

### Template Operations

#### `GET /api/templates`
Returns all discovered Catalyst connector element templates.

**Response:**
```json
{
  "templates": [
    {
      "$schema": "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      "name": "Send Email",
      "id": "io.camunda.connectors.SendEmail.v1",
      "appliesTo": ["bpmn:ServiceTask"],
      "properties": [...]
    }
  ]
}
```

### Deployment Operations

#### `POST /api/deploy`
Deploys a BPMN diagram to Camunda.

**Request:**
```json
{
  "name": "my-process.bpmn",
  "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>..."
}
```

**Response:**
```json
{
  "id": "deployment-123",
  "deploymentId": "deployment-123",
  "name": "modeler-1704447600000",
  "deployedProcessDefinitions": {...}
}
```

### Health Check

#### `GET /health`
Returns service health status.

**Response:**
```json
{
  "status": "healthy"
}
```

## User Guide

### Creating a New Process

1. Navigate to `http://localhost/modeler/`
2. Click the **"+ New"** button in the file browser
3. Enter a filename (e.g., `email-workflow`)
4. Click **"Create"**
5. The modeler opens with an empty BPMN diagram

### Adding Catalyst Connectors

1. Drag a **Service Task** from the palette onto the canvas
2. Click on the Service Task to select it
3. In the **Properties Panel** on the right, click the **Template** dropdown
4. Select a Catalyst connector (e.g., "Send Email")
5. Configure the connector properties in the panel

### Available Connectors

All connectors from the `connectors/` directory are automatically loaded:
- Send Email
- Slack Notification
- Google Sheets
- HTTP Request
- IP Geolocation
- Weather Forecast
- XAI Text Analysis

### Saving Your Work

**Option 1: Save Button**
- Click the **"Save"** button in the sidebar (under the file list)

**Option 2: Keyboard Shortcut**
- Press **Ctrl+S**

**Option 3: Auto-save**
- Changes are tracked automatically via the Miragon event system

### Deploying to Camunda

1. Ensure your process is saved
2. Click the **"Deploy"** button in the sidebar
   - Or press **Ctrl+D**
3. Wait for the success notification
4. The deployment ID will be shown in the toast notification

The process is now available in Camunda and can be started from:
- Camunda Cockpit: `http://localhost/camunda/app/cockpit/`
- Camunda Tasklist: `http://localhost/camunda/app/tasklist/`
- REST API: `POST http://localhost/camunda-api/process-definition/key/{process-key}/start`

### Downloading BPMN Files

1. Select a file from the file browser
2. Click the **"Download"** button in the sidebar
3. The BPMN XML file will be downloaded to your local machine

### Refreshing Templates

If you add new connectors while the modeler is running:

1. Click the **"Refresh Templates"** button in the sidebar
2. New connectors will be loaded without restarting the service

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+S** | Save current file |
| **Ctrl+D** | Deploy to Camunda |

## File Storage

BPMN files are stored in the `bpmn-files/` directory at the repository root:

```
catalyst-connector/
├── bpmn-files/              # Your BPMN diagrams (bind mounted)
│   ├── email-workflow.bpmn
│   ├── approval-process.bpmn
│   └── ...
├── connectors/              # Connector templates (read-only)
├── docker/
└── packages/
    └── web-modeler/
```

**Benefits of local storage:**
- Files visible in File Explorer / Finder
- Can edit BPMN files in external editors (VS Code, Notepad++)
- Easy backup: just copy the folder
- Version control: commit BPMN files to git

**Backup your diagrams:**
```bash
# Copy to backup location
cp -r bpmn-files bpmn-files-backup-$(date +%Y%m%d)

# Or use git
git add bpmn-files/
git commit -m "Backup BPMN diagrams"
```

## Development

### Running Locally (Development Mode)

**Backend:**
```bash
cd packages/web-modeler/server
npm install
npm run dev  # Runs on http://localhost:3000
```

**Frontend:**
```bash
cd packages/web-modeler/client
npm install
npm run dev  # Runs on http://localhost:5173 with API proxy
```

### Building for Production

```bash
# Build Docker image
cd packages/web-modeler
docker build -t catalyst-modeler:latest .

# Run container
docker run -p 3000:3000 \
  -v $(pwd)/../../bpmn-files:/app/bpmn-files \
  -v $(pwd)/../../connectors:/app/connectors:ro \
  -e CAMUNDA_API_URL=http://camunda:8080/engine-rest \
  catalyst-modeler:latest
```

### Docker Compose Deployment

The modeler is automatically started with the full Catalyst stack:

```bash
cd docker
docker-compose up -d modeler
```

**Service Configuration:**
```yaml
modeler:
  image: catalyst-modeler:latest
  container_name: catalyst-modeler
  environment:
    - NODE_ENV=production
    - PORT=3000
    - BPMN_DIR=/app/bpmn-files
    - CONNECTORS_DIR=/app/connectors
    - CAMUNDA_API_URL=http://camunda:8080/engine-rest
  volumes:
    - ../bpmn-files:/app/bpmn-files
    - ../connectors:/app/connectors:ro
  networks:
    - catalyst-network
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `3000` | Server port |
| `BPMN_DIR` | `/app/bpmn-files` | BPMN file storage directory |
| `CONNECTORS_DIR` | `/app/connectors` | Connector templates directory |
| `CAMUNDA_API_URL` | `http://camunda:8080/engine-rest` | Camunda REST API URL |
| `TZ` | `UTC` | Timezone for timestamps |

## Troubleshooting

### Templates Not Loading

**Symptom:** Properties panel shows no connector templates

**Check 1: Connector volume mount**
```bash
docker exec catalyst-modeler ls -la /app/connectors
# Should show connector directories
```

**Check 2: Server logs**
```bash
docker logs catalyst-modeler
# Look for "Loaded N element templates"
```

**Check 3: API endpoint**
```bash
curl http://localhost/modeler/api/templates
# Should return JSON array of templates
```

**Fix:**
1. Verify `connectors` volume mount in `docker-compose.yml`
2. Restart modeler service: `docker-compose restart modeler`
3. Click "Refresh Templates" button in the modeler

### Deploy Fails

**Symptom:** "Deployment failed" toast notification

**Check 1: Camunda is running**
```bash
docker ps | grep camunda
# Should show catalyst-camunda container
```

**Check 2: Camunda REST API**
```bash
curl http://localhost/camunda-api/version
# Should return Camunda version info
```

**Check 3: BPMN XML is valid**
- Look for red errors/warnings in the modeler canvas
- Check that all Service Tasks have required connector properties filled

**Common deployment errors:**
- **Invalid XML:** Missing required attributes or malformed BPMN
- **Camunda unavailable:** Service not running or network issue
- **Missing connector implementation:** Connector template used but n8n workflow not deployed

### Properties Panel Blank

**Symptom:** Properties panel visible but shows no properties

**This was a known issue that has been fixed.** If you still experience this:

1. Check browser console for JavaScript errors (F12 → Console)
2. Verify element templates are loading: `curl http://localhost/modeler/api/templates`
3. Rebuild modeler: `docker-compose build modeler && docker-compose up -d modeler`
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Files Not Persisting

**Symptom:** BPMN files disappear after container restart

**Check volume mount:**
```bash
docker inspect catalyst-modeler | grep -A 5 Mounts
# Should show bind mount to ../bpmn-files
```

**Fix:**
1. Stop modeler: `docker-compose stop modeler`
2. Verify `docker-compose.yml` has correct volume mount
3. Ensure `bpmn-files/` directory exists in repository root
4. Restart: `docker-compose up -d modeler`

### Cannot Save Files

**Symptom:** "Failed to save" toast notification

**Check 1: Directory permissions**
```bash
docker exec catalyst-modeler ls -la /app/bpmn-files
# Should be writable by 'node' user (UID 1000)
```

**Check 2: Disk space**
```bash
df -h
# Ensure sufficient free space
```

**Check 3: File path validation**
- Filename must end with `.bpmn`
- No path traversal characters (`../`, `./`)
- Maximum 255 characters

### nginx 404 Errors

**Symptom:** Clicking modeler link shows 404 or control panel

**Check nginx configuration:**
```bash
docker exec catalyst-nginx cat /etc/nginx/conf.d/default.conf
# Look for /modeler/ location block
```

**Verify trailing slashes:**
```nginx
location /modeler/ {
    proxy_pass http://modeler:3000/;  # Must have trailing /
}
```

**Fix:**
1. Verify nginx config has correct routing
2. Reload nginx: `docker-compose exec nginx nginx -s reload`
3. Hard refresh browser (Ctrl+Shift+R)

### JavaScript MIME Type Error

**Symptom:** "Expected JavaScript module but got text/html"

**This indicates incorrect Vite base path configuration.**

**Check `vite.config.ts`:**
```typescript
export default defineConfig({
  base: '/modeler/',  // Must match nginx route
})
```

**Fix:**
1. Rebuild frontend: `cd packages/web-modeler/client && npm run build`
2. Rebuild Docker: `docker-compose build modeler`
3. Restart: `docker-compose up -d modeler`

## Security

### Path Traversal Protection

The file service validates all filenames to prevent path traversal attacks:

```typescript
private validateFilename(filename: string): void {
  if (!filename.endsWith('.bpmn'))
    throw new Error('Only .bpmn files allowed')
  if (filename.includes('..') || filename.includes('/'))
    throw new Error('Path traversal detected')
  if (filename.length > 255)
    throw new Error('Filename too long')
}
```

### File Size Limits

- Maximum request body size: **10MB** (configured in Express)
- Recommended BPMN file size: **< 5MB**

### CORS Configuration

CORS is handled by nginx for `/modeler/api/` routes:

```nginx
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
```

## Performance

### Build Optimization

The Docker build uses multi-stage builds to minimize image size:

```dockerfile
# Stage 1: Build React client (6.3MB assets)
FROM node:20-alpine AS client-builder
# ... build client

# Stage 2: Build Express server
FROM node:20-alpine AS server-builder
# ... build server

# Stage 3: Production (only compiled assets)
FROM node:20-alpine
COPY --from=server-builder /app/server/dist ./dist
COPY --from=client-builder /app/client/dist ./public
```

**Final image size:** ~200MB (includes Node.js, dependencies, and built assets)

### Template Caching

Element templates are loaded once on server startup and cached in memory. Click "Refresh Templates" to reload without restarting.

### Asset Caching

Vite build outputs hashed filenames for static assets, enabling long-term browser caching:
- CSS: `index-B1AvTKTI.css`
- JS: `index-CvXplWRe.js`
- Fonts: `bpmn-sIjfRMkI.woff2`

## Future Enhancements

### Phase 2 Features (Not Yet Implemented)

- **DMN Editor** - Add decision table modeling (Miragon provides `DmnModeler` component)
- **Process Versioning** - Git integration for BPMN version history
- **Collaboration** - Real-time shared editing
- **Camunda Import** - Import existing deployments from Camunda
- **Template Marketplace** - Browse and install community connector templates
- **Auto-save** - Debounced automatic saving
- **Undo/Redo Indicators** - Visual feedback for history operations
- **File Rename** - Right-click menu to rename files

### Adding DMN Support (Future)

The Miragon library already provides a `DmnModeler` component. To add DMN support:

1. Install DMN dependencies (likely already included)
2. Create `DmnModeler.tsx` component similar to `BpmnModeler.tsx`
3. Update file browser to handle `.dmn` files
4. Add DMN-specific routes to backend
5. Update nginx routing for DMN editor at `/modeler/dmn/`

## Contributing

When adding new features to the modeler:

1. **Backend changes:** Update files in `packages/web-modeler/server/src/`
2. **Frontend changes:** Update files in `packages/web-modeler/client/src/`
3. **Rebuild Docker:** `docker-compose build modeler`
4. **Test thoroughly:** Verify file operations, templates, and deployment
5. **Update documentation:** Add to this README

### Code Style

- **TypeScript:** Strict mode enabled
- **React:** Functional components with hooks
- **File naming:** PascalCase for components, camelCase for utilities
- **Imports:** Type-only imports use `import type { ... }`

## Support

For issues or questions:

1. Check this README's troubleshooting section
2. Review Docker logs: `docker logs catalyst-modeler`
3. Check browser console (F12) for frontend errors
4. Verify Camunda service is healthy
5. Open an issue in the repository

## License

Part of the Catalyst Connector project.
