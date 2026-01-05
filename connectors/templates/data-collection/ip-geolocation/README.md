# Catalyst IP Geolocation Connector

Look up geographic location data for any IP address using the free [ip-api.com](https://ip-api.com) service.

## Overview

This connector enables Camunda processes to retrieve geolocation information for IP addresses, including:
- Country, region, and city
- Geographic coordinates (latitude/longitude)
- Timezone information
- ISP and organization details

## Features

- **Free API**: No authentication required (ip-api.com free tier)
- **Rich data**: Returns country, city, coordinates, timezone, ISP, and more
- **Simple input**: Just provide an IP address
- **Structured output**: All fields mapped to individual process variables

## Installation

### 1. Import n8n Workflow

1. Open your n8n instance
2. Click **Workflows** > **Import from File**
3. Select `ip-geolocation.n8n.json`
4. **Activate** the workflow (toggle in top right)

The webhook will be available at: `http://catalyst-n8n:5678/webhook/catalyst-ip-geolocation`

### 2. Deploy Element Template

1. Copy `ip-geolocation.element.json` to your Camunda Modeler element templates directory:
   - Windows: `%APPDATA%\camunda-modeler\resources\element-templates`
   - macOS: `~/Library/Application Support/camunda-modeler/resources/element-templates`
   - Linux: `~/.config/camunda-modeler/resources/element-templates`
2. Restart Camunda Modeler
3. The template will appear as **Catalyst - IP Geolocation** in the template catalog

## Configuration

### Camunda Side

1. Add a **Service Task** to your BPMN process
2. Click the **wrench icon** > **Catalyst - IP Geolocation**
3. Configure the **IP Address** field:
   - Hardcoded: `8.8.8.8`
   - From variable: `${ipAddress}`

### n8n Side

No configuration needed - the workflow is ready to use with the free ip-api.com service.

**Rate Limit**: ip-api.com allows 45 requests per minute from an IP address.

## Example Usage

### Auto-Detect IP (Leave Blank)

If you leave the IP address field empty, the API will automatically detect and return the location of n8n server's IP address:

```javascript
// Leave ipAddress empty or don't set it
execution.setVariable("ipAddress", "");
```

### Specific IP Lookup

**Set IP Address** (Script Task before the Service Task):
```javascript
execution.setVariable("ipAddress", "8.8.8.8");
```

**Output Variables** (automatically set after Service Task):
```javascript
success = true
country = "United States"
countryCode = "US"
region = "Virginia"
city = "Ashburn"
zip = "20149"
lat = 39.03
lon = -77.5
timezone = "America/New_York"
isp = "Google LLC"
org = "Google Public DNS"
```

### Using Process Variables

If you have an IP address from user input or another service:

```javascript
// IP address could come from:
// - User form input
// - Previous service task
// - External system
var userIP = execution.getVariable("customerIP");
execution.setVariable("ipAddress", userIP);
```

## Response Structure

The connector returns data from ip-api.com in a structured format:

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "responseBody": {
    "status": "success",
    "country": "United States",
    "countryCode": "US",
    "region": "VA",
    "regionName": "Virginia",
    "city": "Ashburn",
    "zip": "20149",
    "lat": 39.03,
    "lon": -77.5,
    "timezone": "America/New_York",
    "isp": "Google LLC",
    "org": "Google Public DNS",
    "as": "AS15169 Google LLC",
    "query": "8.8.8.8"
  },
  "error": null
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "responseBody": {
    "status": "fail",
    "message": "invalid query",
    "query": "invalid-ip"
  },
  "error": "invalid query"
}
```

## Process Variable Reference

### Input Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `ipAddress` | String | No | IP address to look up. Leave blank to auto-detect caller's IP. | `"8.8.8.8"` or `""` |

### Output Variables

| Variable | Type | Description |
|----------|------|-------------|
| `success` | Boolean | `true` if lookup succeeded |
| `statusCode` | Number | HTTP status code |
| `country` | String | Country name |
| `countryCode` | String | ISO 3166-1 alpha-2 code |
| `region` | String | Region/state name |
| `city` | String | City name |
| `zip` | String | Postal code |
| `lat` | Number | Latitude coordinate |
| `lon` | Number | Longitude coordinate |
| `timezone` | String | Timezone identifier |
| `isp` | String | Internet Service Provider |
| `org` | String | Organization name |
| `error` | String | Error message (null on success) |

## Troubleshooting

### Issue: "invalid query"

**Cause**: The IP address format is invalid.

**Solution**: Ensure the IP address is a valid IPv4 or IPv6 format:
- Valid: `8.8.8.8`, `2001:4860:4860::8888`
- Invalid: `256.1.1.1`, `not-an-ip`

### Issue: Rate Limited (HTTP 429)

**Cause**: Exceeded 45 requests per minute from your server.

**Solution**:
- Add delays between requests in batch processing
- Consider upgrading to ip-api.com Pro for higher limits

### Issue: Empty Location Data

**Cause**: Some IP addresses (private, reserved) don't have geolocation data.

**Solution**: This is expected for:
- Private IPs: `10.x.x.x`, `192.168.x.x`, `172.16-31.x.x`
- Localhost: `127.0.0.1`
- Reserved ranges

## Files in this Connector

| File | Description |
|------|-------------|
| `ip-geolocation.n8n.json` | n8n webhook workflow (for Camunda) |
| `ip-geolocation-form.n8n.json` | n8n form workflow (for development/testing) |
| `ip-geolocation.element.json` | Camunda Modeler element template |
| `ip-geolocation.bpmn` | Example BPMN process |
| `README.md` | This documentation |

## Development

The `ip-geolocation-form.n8n.json` workflow uses a Form Trigger for easy testing:

1. Import into n8n
2. Click "Test workflow"
3. Enter an IP address in the form
4. View the formatted results

This is the **source of truth** for the connector. The webhook version (`ip-geolocation.n8n.json`) is generated from it.

## License

Part of the Catalyst Connector project.
