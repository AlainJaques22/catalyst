# Official Catalyst Connectors

Pre-built, production-ready connectors maintained by the Catalyst team.

## Available Connectors

| Connector | Description | API |
|-----------|-------------|-----|
| [http-request](./http-request/) | Generic HTTP requests to any REST API | Any REST API |
| [http-request-weather-forecast](./http-request-weather-forecast/) | Weather data for any location | Open-Meteo |
| [ip-geolocation](./ip-geolocation/) | Geographic location from IP address | ip-api.com |
| [xai-text-analysis](./xai-text-analysis/) | AI-powered text analysis | X.AI Grok |

## Connector Structure

Each connector contains these files:

```
connector-name/
  connector-name.n8n.json        # n8n webhook workflow (for Camunda)
  connector-name-form.n8n.json   # n8n form workflow (for testing) [optional]
  connector-name.element.json    # Camunda Modeler element template
  connector-name.bpmn            # Example BPMN process
  README.md                      # Documentation
```

## Installation

### Step 1: Import n8n Workflow

1. Open your n8n instance
2. Click **Workflows** > **Import from File**
3. Select the `connector-name.n8n.json` file
4. **Activate** the workflow

### Step 2: Deploy Element Template

Copy the `.element.json` file to your Camunda Modeler templates directory:

| OS | Path |
|----|------|
| Windows | `%APPDATA%\camunda-modeler\resources\element-templates` |
| macOS | `~/Library/Application Support/camunda-modeler/resources/element-templates` |
| Linux | `~/.config/camunda-modeler/resources/element-templates` |

Restart Camunda Modeler after copying.

### Step 3: Use in BPMN

1. Add a **Service Task** to your process
2. Click the wrench icon to apply a template
3. Select the Catalyst connector you installed
4. Configure the input parameters

## Creating New Connectors

### Development Workflow

1. **Build in n8n** with Form Trigger (easy to test in browser)
2. **Test** until the workflow works correctly
3. **Export** the form workflow as JSON
4. **Convert** to webhook version (Form Trigger > Webhook, Form > Respond to Webhook)
5. **Create** element template and BPMN example
6. **Copy** element template to `modeler/resources/element-templates/`
7. **Document** in README.md

### File Naming Convention

- Use kebab-case: `my-connector-name`
- All files use the same base name
- Form version (if present) adds `-form` suffix

### Element Template Requirements

- Must use `io.catalyst.bridge.CatalystBridge` as the implementation class
- Must include `webhookUrl`, `timeout`, `payload`, and `outputMapping` parameters
- Use `${variableName}` syntax for variable substitution (NOT FEEL)
- Use `"type": "Text"` for multi-line JSON fields
- **NEVER** use `scriptFormat: "feel"` in bindings

### Testing

1. Import the BPMN example into Camunda
2. Start a process instance
3. Verify the service task executes successfully
4. Check that output variables are set correctly

## Contributing

See the main project [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Support

- Check individual connector README files for troubleshooting
- Review example BPMN processes for usage patterns
- Check n8n workflow execution logs for detailed error information
