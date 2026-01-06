# Nginx Reverse Proxy Configuration

This nginx configuration serves as the main entry point for the Catalyst Control Panel, providing:
- Static file hosting for the Control Panel UI
- Reverse proxy to n8n and Camunda services
- CORS headers for API access from the browser

## Architecture Overview

```
                                    +------------------+
                                    |   Browser        |
                                    |   localhost:80   |
                                    +--------+---------+
                                             |
                                             v
+------------------------------------------------------------------------------------+
|                              NGINX (catalyst-nginx)                                |
|                                    Port 80                                         |
+------------------------------------------------------------------------------------+
|                                                                                    |
|  /                    -->  Static files (Control Panel)                            |
|  /n8n/                -->  http://n8n:5678/           (n8n UI + API)               |
|  /webhook/            -->  http://n8n:5678/webhook/   (n8n webhooks)               |
|  /camunda-api/        -->  http://camunda:8080/engine-rest/  (Camunda REST API)    |
|  /camunda/            -->  http://camunda:8080/camunda/      (Camunda Web Apps)    |
|  /images/             -->  Static files (images)                                   |
|                                                                                    |
+------------------------------------------------------------------------------------+
                    |                    |                    |
                    v                    v                    v
           +---------------+    +---------------+    +------------------+
           |     n8n       |    |    Camunda    |    |  Control Panel   |
           |  Port 5678    |    |   Port 8080   |    |  (static files)  |
           +---------------+    +---------------+    +------------------+
```

## Route Configuration

### `/` - Control Panel (Static Files)
```nginx
location / {
    root   /usr/share/nginx/html;
    index  index.html;
    try_files $uri $uri/ /index.html;
}
```
- Serves the Catalyst Control Panel from `/usr/share/nginx/html`
- Uses `try_files` for SPA-style routing (falls back to index.html)
- Mounted from `../packages/control-panel` in docker-compose

### `/n8n/` - n8n Application & API
```nginx
location /n8n/ {
    proxy_pass http://n8n:5678/;
    # ... headers and CORS config
}
```
- Proxies all n8n traffic (UI and API)
- API endpoints: `/n8n/api/v1/workflows`, `/n8n/api/v1/executions`, etc.
- Health check: `/n8n/healthz`
- Includes CORS headers for browser API access

**Example API calls from Control Panel:**
```javascript
// Fetch workflows
fetch('/n8n/api/v1/workflows', {
    headers: { 'X-N8N-API-KEY': 'your-api-key' }
});

// Fetch executions
fetch('/n8n/api/v1/executions?limit=20', {
    headers: { 'X-N8N-API-KEY': 'your-api-key' }
});
```

### `/webhook/` - n8n Webhooks
```nginx
location /webhook/ {
    proxy_pass http://n8n:5678/webhook/;
}
```
- Direct proxy for n8n webhook endpoints
- Used by external services to trigger n8n workflows
- No CORS needed (server-to-server communication)

### `/camunda-api/` - Camunda REST API
```nginx
location /camunda-api/ {
    proxy_pass http://camunda:8080/engine-rest/;
    # ... headers and CORS config
}
```
- Proxies Camunda's REST API
- Used by Control Panel to fetch process instances, history, etc.
- Includes CORS headers for browser API access

**Example API calls from Control Panel:**
```javascript
// Get engine version
fetch('/camunda-api/version');

// Get process instance history
fetch('/camunda-api/history/process-instance?sortBy=startTime&sortOrder=desc&maxResults=10');

// Get active process definitions
fetch('/camunda-api/process-definition');
```

### `/camunda/` - Camunda Web Applications
```nginx
location /camunda/ {
    proxy_pass http://camunda:8080/camunda/;
}
```
- Proxies Camunda's web applications:
  - **Cockpit**: `/camunda/app/cockpit/` - Process monitoring
  - **Tasklist**: `/camunda/app/tasklist/` - User task management
  - **Admin**: `/camunda/app/admin/` - User and group administration

### `/images/` - Static Images
```nginx
location /images/ {
    root /usr/share/nginx/html;
}
```
- Serves static images for the Control Panel
- Files located at `/usr/share/nginx/html/images/`

### `/dashboard/` - Dashboard Pages
```nginx
location /dashboard/ {
    alias /usr/share/nginx/dashboard/;
    index index.html;
    try_files $uri $uri/ =404;
}
```
- Serves additional dashboard and monitoring pages
- Files located at `/usr/share/nginx/dashboard/`

### `/connector-builder/` - Connector Builder Tool
```nginx
location /connector-builder/ {
    alias /usr/share/nginx/connector-builder/;
    index index.html;
    try_files $uri $uri/ =404;
}
```
- Interactive tool for creating Catalyst connectors from n8n workflows
- Auto-generates element templates, BPMN, and documentation
- Files located at `/usr/share/nginx/connector-builder/`

## CORS Configuration

CORS (Cross-Origin Resource Sharing) headers are added to `/n8n/` and `/camunda-api/` routes to allow the Control Panel (served from `/`) to make API requests.

### Headers Added
```nginx
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,X-N8N-API-KEY' always;
add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
```

### Preflight Requests (OPTIONS)
Browser sends OPTIONS requests before actual API calls. These are handled with:
```nginx
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' '...';
    add_header 'Access-Control-Max-Age' 1728000;  # Cache preflight for 20 days
    return 204;  # No content
}
```

**Note:** The `always` parameter ensures headers are added even on error responses (4xx, 5xx).

## Docker Compose Integration

```yaml
nginx:
  image: nginx:alpine
  container_name: catalyst-nginx
  ports:
    - "80:80"
  volumes:
    - ../packages/control-panel:/usr/share/nginx/html:ro
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - n8n
    - camunda
  networks:
    - catalyst-network
```

### Volume Mounts
| Host Path | Container Path | Purpose |
|-----------|----------------|---------|
| `../packages/control-panel` | `/usr/share/nginx/html` | Control Panel static files |
| `../packages/dashboard` | `/usr/share/nginx/dashboard` | Dashboard pages |
| `../packages/connector-builder` | `/usr/share/nginx/connector-builder` | Connector Builder tool |
| `./nginx/nginx.conf` | `/etc/nginx/nginx.conf` | Nginx configuration |

### Network
All services are on the `catalyst-network` bridge network, allowing nginx to resolve service names:
- `n8n` resolves to the n8n container
- `camunda` resolves to the Camunda container

## Common Operations

### Restart nginx (apply config changes)
```bash
docker-compose restart nginx
```

### Force recreate nginx container
```bash
docker-compose up -d --force-recreate nginx
```

### View nginx logs
```bash
docker logs catalyst-nginx
docker logs -f catalyst-nginx  # Follow logs
```

### Test nginx configuration
```bash
docker exec catalyst-nginx nginx -t
```

### Reload nginx config without restart
```bash
docker exec catalyst-nginx nginx -s reload
```

## Troubleshooting

### CORS Errors in Browser Console
- Verify the `always` flag is present on `add_header` directives
- Check that OPTIONS preflight handling returns 204
- Ensure the header includes the specific header causing issues (e.g., `X-N8N-API-KEY`)

### 502 Bad Gateway
- Service might not be running: `docker-compose ps`
- Check service logs: `docker logs catalyst-n8n` or `docker logs catalyst-camunda`
- Verify network connectivity: `docker exec catalyst-nginx ping n8n`

### 404 Not Found
- Check the proxy path mapping (trailing slashes matter!)
- Verify the upstream service has the expected endpoint

### Static Files Not Updating
- Files are mounted read-only (`:ro`), changes should reflect immediately
- Clear browser cache or hard refresh (Ctrl+Shift+R)
- Check file permissions on host

## Security Considerations

1. **CORS `*` Origin**: Currently allows all origins. For production, restrict to specific domains:
   ```nginx
   add_header 'Access-Control-Allow-Origin' 'https://yourdomain.com' always;
   ```

2. **API Keys**: The n8n API key is passed via `X-N8N-API-KEY` header. Ensure this key is kept secure.

3. **No HTTPS**: This configuration uses HTTP only. For production, add SSL/TLS:
   ```nginx
   listen 443 ssl;
   ssl_certificate /etc/nginx/ssl/cert.pem;
   ssl_certificate_key /etc/nginx/ssl/key.pem;
   ```

4. **No Rate Limiting**: Consider adding rate limiting for production:
   ```nginx
   limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
   location /n8n/ {
       limit_req zone=api burst=20 nodelay;
       # ...
   }
   ```
