# Installation

Catalyst is a Docker-based platform that bridges Camunda 7 to n8n's 400+ integrations. Everything runs in a single Docker container - no complex setup, no dependency hell.

## Prerequisites

All you need is Docker. Seriously.

Get Docker at https://www.docker.com/

## Quick Install

Clone the repository and start the Docker containers:

```bash
git clone https://github.com/AlainJaques22/catalyst.git
cd catalyst/docker
docker-compose up -d
```

That's it. Full platform running.

## What Gets Installed

One `docker-compose up` gives you:

- **Camunda 7** - BPMN process engine
- **n8n** - 400+ integrations and workflow automation
- **PostgreSQL** - Database
- **Nginx** - Reverse proxy
- **Control Panel** - Unified web interface
- **BPMN Modeler** - Web-based process designer

All pre-configured and ready to use.

## Access Your Installation

Once the containers are running, access everything through your browser:

| Service | URL | Description |
|---------|-----|-------------|
| **Control Panel** | http://localhost | Main dashboard and navigation |
| **Camunda Cockpit** | http://localhost:8080/camunda | Process monitoring and management |
| **n8n** | http://localhost:5678 | Workflow automation platform |
| **BPMN Modeler** | http://localhost/modeler | Web-based process designer |

Default credentials for Camunda Cockpit:
- Username: `demo`
- Password: `demo`

## Verify Installation

Open http://localhost and you should see the Catalyst Control Panel:

- Quick launch buttons for all services
- Connector gallery
- Live logs
- Stats dashboard
- Health status indicators

All services should show green status indicators.

## Directory Structure

After cloning, your directory structure looks like this:

```
catalyst/
├── docker/
│   ├── docker-compose.yml      # Main deployment configuration
│   └── ...                      # Docker-related files
├── packages/
│   ├── bridge/                  # Catalyst Bridge (Camunda delegate)
│   ├── website/                 # Control panel web interface
│   └── modeler/                 # BPMN modeler
├── connectors/
│   ├── integrations/            # Official connectors
│   └── templates/               # Connector templates
└── docs/                        # Documentation
```

## What Runs Where

All services run inside Docker containers with internal networking:

```
Container Network (catalyst_default)
├── catalyst-camunda:8080        # Camunda 7 engine
├── catalyst-n8n:5678            # n8n automation platform
├── catalyst-postgres:5432       # PostgreSQL database
└── catalyst-nginx:80            # Nginx reverse proxy
```

External access is only through port 80 (nginx), which routes to all internal services.

## Stopping and Starting

Stop all services:
```bash
cd catalyst/docker
docker-compose down
```

Start services:
```bash
cd catalyst/docker
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

View logs for specific service:
```bash
docker-compose logs -f camunda
docker-compose logs -f n8n
```

## Updating Catalyst

Pull the latest changes:
```bash
cd catalyst
git pull origin main
cd docker
docker-compose down
docker-compose up -d --build
```

Note: This rebuilds containers with the latest code. Your process data is preserved in the PostgreSQL database volume.

## Data Persistence

Catalyst uses Docker volumes to persist data:

- **PostgreSQL database** - All Camunda processes, n8n workflows, and credentials
- **n8n data** - Workflow configurations and credentials

To completely remove all data:
```bash
docker-compose down -v
```

Warning: This deletes all processes, workflows, and configurations. Use only for fresh start.

## Troubleshooting

### Port 80 Already in Use

If another service is using port 80:

1. Stop the conflicting service, or
2. Edit `docker-compose.yml` to use a different port:
   ```yaml
   nginx:
     ports:
       - "8888:80"  # Change to any available port
   ```
   Then access via http://localhost:8888

### Services Won't Start

Check if all containers are running:
```bash
docker-compose ps
```

Check logs for errors:
```bash
docker-compose logs
```

### Database Connection Errors

If Camunda can't connect to PostgreSQL:

1. Verify the database container is running:
   ```bash
   docker-compose ps postgres
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

3. Restart all services:
   ```bash
   docker-compose restart
   ```

### Out of Disk Space

Docker images and volumes can consume significant disk space. Clean up:

```bash
# Remove unused Docker resources
docker system prune -a

# Remove only Catalyst volumes (WARNING: deletes all data)
docker-compose down -v
```

## System Requirements

**Minimum:**
- 4 GB RAM
- 10 GB disk space
- Docker Desktop or Docker Engine 20.10+

**Recommended:**
- 8 GB RAM
- 20 GB disk space
- SSD storage for better performance

## Next Steps

Now that Catalyst is installed:

1. [Quick Start Guide](quickstart.md) - Create your first integration
2. [Architecture Overview](../bridge/architecture.md) - Understand how it works
3. [Creating Connectors](../connectors/creating.md) - Build your own connectors

## Production Deployment

For production use:

1. **Use HTTPS**: Configure SSL certificates in nginx
2. **Change credentials**: Update default Camunda passwords
3. **Configure backups**: Set up PostgreSQL backups
4. **Set resource limits**: Configure Docker resource constraints
5. **Configure webhook allowlist**: Set `CATALYST_WEBHOOK_ALLOWLIST` environment variable for production n8n URLs

See [Bridge Configuration](../bridge/configuration.md) for production settings.

## License

Development is free. Production requires a license starting at $192/year.

See the main [README.md](../../README.md) for pricing details.
