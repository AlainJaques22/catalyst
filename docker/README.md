# Catalyst Camunda Custom Docker Image

This custom Docker image extends the official Camunda BPM Platform 7.21.0 with three key modifications:

1. **Removed sample webapps** - Eliminates the annoying examples, docs, h2 console, and invoice sample that respawn on restart
2. **Pre-deployed catalyst-bridge delegate** - Includes the CatalystConnector in the userlib for immediate use
3. **CORS enabled** - REST API configured to accept requests from external dashboards and applications

## Prerequisites

- Docker and Docker Compose installed
- Your `catalyst-bridge-*.jar` file in this directory

## Quick Start

### 1. Configure Timezone

Set the timezone to match your local system (Windows):

```powershell
.\set-timezone.ps1
```

This script will:
- Detect your Windows timezone
- Convert it to IANA format (Linux timezone format)
- Create a `.env` file with the TZ variable

### 2. Place Your JAR File

Make sure your catalyst-bridge JAR is in the same directory as the Dockerfile:

```bash
# Your directory should look like:
# .
# ├── Dockerfile
# ├── docker-compose.yml
# ├── build.sh
# ├── set-timezone.ps1
# ├── .env                       # Created by set-timezone.ps1
# ├── bpm-platform.xml           # Camunda configuration
# ├── web.xml
# └── catalyst-bridge-1.0.0.jar  # (or whatever version)
```

### 3. Build the Image

```bash
./build.sh
```

Or manually:

```bash
docker-compose build camunda
```

### 4. Start the Stack

```bash
docker-compose up -d
```

## Access the Services

- **Camunda Cockpit**: http://localhost:8080/camunda
  - Default credentials: demo/demo
  - No more sample apps cluttering your workspace!

- **Camunda REST API**: http://localhost:8080/engine-rest
  - For Camunda Modeler, use this URL to deploy and test processes

- **n8n**: http://localhost:5678
  - Username: admin
  - Password: Catalyst2024!
  - **Important**: Create webhook workflows here that match the URLs used in your BPMN processes

- **PostgreSQL**: localhost:5432
  - Database: camunda
  - User: camunda
  - Password: camunda

## Viewing Logs

### Command Line

```bash
# View live logs (follows as new logs appear)
docker-compose logs -f camunda

# View last 100 lines
docker-compose logs --tail=100 camunda

# View all logs
docker-compose logs camunda

# View logs for all services
docker-compose logs -f
```

### Docker Desktop GUI

1. Open **Docker Desktop**
2. Go to the **Containers** tab
3. Click on **catalyst-camunda** container
4. Click the **Logs** tab at the top
5. You'll see the live log stream with search and download options

## Updating the catalyst-bridge JAR

When you have a new version of the catalyst-bridge:

1. Replace the JAR file in this directory
2. Rebuild the image (forcing a fresh build):
   ```bash
   docker-compose build camunda --no-cache
   ```
3. Restart the container:
   ```bash
   docker-compose up -d
   ```

## Verifying the Modifications

### Check that sample webapps are removed:

```bash
docker exec catalyst-camunda ls -la /camunda/webapps/
```

You should only see: `camunda` and `engine-rest`

### Verify catalyst-bridge is deployed:

```bash
docker exec catalyst-camunda ls -la /camunda/lib/catalyst-bridge*.jar
```

You should see your `catalyst-bridge-*.jar` file in the lib directory (on Tomcat's classpath)

## Configuration

### Timezone

The timezone is **automatically configured** based on your local system timezone using the `set-timezone.ps1` script.

#### How it works:
1. The `set-timezone.ps1` script detects your Windows timezone
2. Converts it to IANA format (e.g., "South Africa Standard Time" → "Africa/Johannesburg")
3. Creates a `.env` file with `TZ=Your/Timezone`
4. All containers (Camunda, n8n, PostgreSQL) use this timezone

#### Manual timezone configuration:
If you need to set a different timezone, you can either:

**Option 1: Edit the .env file directly**
```bash
TZ=Europe/London  # or America/New_York, Asia/Tokyo, etc.
```

**Option 2: Run the timezone script on a different machine**
```powershell
.\set-timezone.ps1
```

After changing the timezone, rebuild and restart:
```bash
docker-compose down
docker-compose build camunda --no-cache
docker-compose up -d
```

#### Supported Timezones:
The script includes mappings for common Windows timezones. If your timezone isn't mapped, it defaults to UTC. Common timezones:
- South Africa Standard Time → Africa/Johannesburg
- GMT Standard Time → Europe/London
- Eastern Standard Time → America/New_York
- Pacific Standard Time → America/Los_Angeles
- Central European Standard Time → Europe/Paris
- China Standard Time → Asia/Shanghai
- And more...

### CORS Settings

CORS is currently configured to allow all origins (`*`). For production, edit `web.xml` and change:

```xml
<param-value>*</param-value>
```

to specific domains:

```xml
<param-value>https://yourdomain.com,https://anotherdomain.com</param-value>
```

Then rebuild the image.

### Serialization Format

Camunda is configured to use JSON as the default serialization format via `bpm-platform.xml`:

```xml
<property name="defaultSerializationFormat">application/json</property>
```

This ensures that process variables are properly serialized as JSON when sent to webhooks via CatalystBridge, instead of using Camunda's internal format.

If you need to change this, edit the `bpm-platform.xml` file and rebuild:
```bash
docker-compose build camunda --no-cache
docker-compose up -d
```

## Troubleshooting

### Container name conflicts

If you get an error like "container name is already in use":

```bash
# Stop and remove old containers
docker-compose down

# If that doesn't work, force remove them
docker rm -f catalyst-postgres catalyst-camunda catalyst-n8n

# Then start fresh
docker-compose up -d
```

### JAR not found during build

Make sure the JAR filename matches the pattern `catalyst-bridge-*.jar` and is in the same directory as the Dockerfile.

### Changes not taking effect

Force a rebuild without cache:
```bash
docker-compose build camunda --no-cache
docker-compose up -d --force-recreate
```

### Check logs

```bash
docker-compose logs -f camunda
```

## Image Details

- **Base Image**: camunda/camunda-bpm-platform:7.21.0
- **Custom Image Tag**: catalyst-camunda:7.21.0-custom
- **Timezone**: Dynamically configured from host system (default: UTC if not configured)
- **Removed Webapps**:
  - /camunda/webapps/examples
  - /camunda/webapps/docs
  - /camunda/webapps/h2
  - /camunda/webapps/camunda-invoice (sample process application)
- **Custom Libraries**: /camunda/lib/ (Tomcat classpath)
- **CORS Configuration**: Enabled for all origins (suitable for development; restrict for production)
- **Default Serialization**: JSON (configured via bpm-platform.xml)

## Network Configuration

All services run on the `catalyst-network` bridge network:
- postgres (internal)
- camunda (port 8080)
- n8n (port 5678)

### Important: Using Webhooks in BPMN Processes

When configuring webhook URLs in your BPMN process definitions (using the CatalystBridge delegate):

**From Camunda Modeler (outside Docker):**
- Use: `http://localhost:5678/webhook/your-webhook-name`
- This works when deploying from your local machine

**From within the Camunda container:**
- Use: `http://catalyst-n8n:5678/webhook/your-webhook-name`
- Use the container name `catalyst-n8n` instead of `localhost`
- This is required for processes running inside Docker

**Setting up webhooks in n8n:**
1. Login to n8n at http://localhost:5678
2. Create a new workflow
3. Add a "Webhook" node
4. Set the webhook path (e.g., `your-webhook-name`)
5. Configure your workflow logic
6. **Activate the workflow** (toggle at top-right) - This is critical!
7. The webhook will be available at: `http://catalyst-n8n:5678/webhook/your-webhook-name`

**Understanding n8n Webhook URLs:**

n8n provides two types of webhook URLs:

- **Test URL** (Development):
  - Format: `http://localhost:5678/webhook-test/[unique-id]`
  - Only works while you're editing the workflow
  - Changes every time you modify the workflow
  - Used for testing during development

- **Production URL** (Activated):
  - Format: `http://localhost:5678/webhook/your-webhook-name`
  - Only works when the workflow is **activated** (toggle must be ON)
  - Permanent and stable URL
  - **This is what you should use in your BPMN processes**

**Important:** The CatalystBridge in your BPMN should use the **production URL** with the container name:
- `http://catalyst-n8n:5678/webhook/your-webhook-name`

**Common Issues:**
- `The requested webhook "xxx" is not registered` - The webhook workflow is not activated in n8n (toggle is OFF)
- `Waiting for trigger event` in n8n - The workflow is in test mode, you need to activate it
- `Connection refused` - You're using `localhost` instead of `catalyst-n8n` in the BPMN