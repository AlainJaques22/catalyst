# Catalyst HTTP Request Connector

A generic HTTP request connector for Catalyst, enabling Camunda processes to make HTTP calls to any REST API endpoint via n8n.

## Overview

This connector provides a secure, flexible way to integrate external REST APIs into your Camunda workflows. It follows the Catalyst hybrid configuration pattern where:

- **Static configuration (in n8n)**: Authentication credentials, API keys, tokens
- **Dynamic data (from Camunda)**: Request method, URL, headers, body, query parameters

This architecture keeps sensitive credentials in n8n, preventing them from being stored in Camunda process history.

## Security Model

**Why keep authentication in n8n?**

Authentication credentials are configured statically in the n8n HTTP Request node, NOT passed from Camunda. This provides several security benefits:

1. **No credentials in process history**: Camunda stores all process variables in its database, including historical data. Keeping credentials in n8n prevents them from being logged.
2. **Centralized credential management**: Update API keys in one place (n8n) without modifying BPMN processes.
3. **Audit trail separation**: API credentials are managed separately from business process data.

For APIs requiring different authentication, create separate n8n workflows with their own authentication configurations (see [Multiple API Patterns](#multiple-api-patterns) below).

## Features

- **All HTTP methods**: GET, POST, PUT, DELETE, PATCH
- **Flexible configuration**: Custom headers, query parameters, request body
- **Error handling**: Structured error responses with status codes
- **Response capture**: Status code, body, headers automatically mapped to process variables
- **Secure by design**: Credentials stored in n8n, not in Camunda

## Installation

### 1. Import n8n Workflow

1. Open your n8n instance
2. Click **Workflows** → **Import from File**
3. Select `http-request.n8n.json`
4. **Activate** the workflow (toggle in top right)

The workflow will be available at: `http://catalyst-n8n:5678/webhook/catalyst-http-request`

### 2. Deploy Element Template

1. Copy `http-request.element.json` to your Camunda Modeler element templates directory:
   - Windows: `%APPDATA%\camunda-modeler\resources\element-templates`
   - macOS: `~/Library/Application Support/camunda-modeler/resources/element-templates`
   - Linux: `~/.config/camunda-modeler/resources/element-templates`
2. Restart Camunda Modeler
3. The template will appear as **Catalyst - HTTP Request** in the template catalog

## Configuration

### n8n Side

The n8n workflow is pre-configured for public APIs (no authentication). To add authentication:

1. Open the workflow in n8n
2. Click the **HTTP Request** node
3. Scroll to **Authentication** section
4. Select your authentication type:
   - **Generic Credential Type** → API Key, Bearer Token, Basic Auth, etc.
   - **Predefined Credential Type** → GitHub, Stripe, Slack, etc.
5. Configure your credentials
6. Save and activate the workflow

**Example: Adding GitHub Authentication**

1. In the HTTP Request node, select **Authentication** → **Predefined Credential Type** → **GitHub**
2. Click **Create New Credential**
3. Enter your GitHub Personal Access Token
4. Save the credential
5. The workflow will now automatically include `Authorization: Bearer <token>` in all requests

### Camunda Side

1. Add a **Service Task** to your BPMN process
2. Click the **wrench icon** → **Catalyst - HTTP Request**
3. Configure the **Payload** field with a JSON object containing:
   - **method**: HTTP method (GET, POST, PUT, DELETE, PATCH)
   - **url**: Full URL to the API endpoint
   - **headers** (optional): JSON object with custom headers
   - **queryParams** (optional): JSON object with URL parameters
   - **body** (optional): JSON object with request body

   Use `${variableName}` to reference process variables in the JSON

## Example Usage

### Example 1: Create a Blog Post (POST Request)

This example uses JSONPlaceholder, a public REST API for testing.

**Payload Configuration**:
```json
{
  "method": "POST",
  "url": "https://jsonplaceholder.typicode.com/posts",
  "headers": {},
  "queryParams": {},
  "body": {
    "title": "My Blog Post",
    "body": "This is the post content",
    "userId": 1
  }
}
```

**Response Variables** (automatically set):
```javascript
success = true
statusCode = 201
responseBody = {
  "id": 101,
  "title": "My Blog Post",
  "body": "This is the post content",
  "userId": 1
}
responseHeaders = {...}
error = null
```

### Example 2: Fetch User Data (GET Request)

**Payload Configuration**:
```json
{
  "method": "GET",
  "url": "https://jsonplaceholder.typicode.com/users/1",
  "headers": {},
  "queryParams": {},
  "body": {}
}
```

**Response Variables**:
```javascript
success = true
statusCode = 200
responseBody = {
  "id": 1,
  "name": "Leanne Graham",
  "email": "Sincere@april.biz",
  ...
}
```

### Example 3: Custom Headers

**Payload Configuration**:
```json
{
  "method": "GET",
  "url": "https://api.example.com/data",
  "headers": {
    "Accept": "application/json",
    "X-Custom-Header": "custom-value"
  },
  "queryParams": {},
  "body": {}
}
```

### Example 4: Query Parameters

**Payload Configuration**:
```json
{
  "method": "GET",
  "url": "https://api.example.com/search",
  "headers": {},
  "queryParams": {
    "q": "searchTerm",
    "limit": 10,
    "offset": 0
  },
  "body": {}
}
```

This will make a request to: `https://api.example.com/search?q=searchTerm&limit=10&offset=0`

To use process variables in the query parameters:
```json
{
  "method": "GET",
  "url": "https://api.example.com/search",
  "queryParams": {
    "q": "${searchTerm}",
    "limit": "${maxResults}"
  }
}
```

## Multiple API Patterns

For different APIs requiring different authentication, create workflow variants:

### Pattern 1: Public API (No Auth)
File: `http-request-public.n8n.json`
- Webhook path: `/webhook/catalyst-http-public`
- No authentication configured
- Use for JSONPlaceholder, public APIs

### Pattern 2: GitHub API (Bearer Token)
File: `http-request-github.n8n.json`
- Webhook path: `/webhook/catalyst-http-github`
- Authentication: GitHub credential (Bearer token)
- Use for GitHub API calls

### Pattern 3: Stripe API (API Key)
File: `http-request-stripe.n8n.json`
- Webhook path: `/webhook/catalyst-http-stripe`
- Authentication: API Key credential
- Use for Stripe payment APIs

**In your BPMN process**, change the **n8n Webhook URL** field to point to the appropriate workflow:
- Public APIs: `http://catalyst-n8n:5678/webhook/catalyst-http-public`
- GitHub: `http://catalyst-n8n:5678/webhook/catalyst-http-github`
- Stripe: `http://catalyst-n8n:5678/webhook/catalyst-http-stripe`

## Response Structure

The connector returns a consistent response structure:

```json
{
  "success": true,
  "statusCode": 200,
  "responseBody": {
    // Parsed JSON response or raw text
  },
  "responseHeaders": {
    "content-type": "application/json",
    "date": "Mon, 01 Jan 2025 00:00:00 GMT",
    ...
  },
  "error": null
}
```

**On error**:
```json
{
  "success": false,
  "statusCode": 404,
  "responseBody": null,
  "responseHeaders": {},
  "error": "HTTP request failed: Not Found"
}
```

## Process Variable Reference

### Input Variables (Set before Service Task)

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `method` | String | Yes | HTTP method | `"POST"` |
| `url` | String | Yes | Full URL to API endpoint | `"https://api.example.com/users"` |
| `headers` | Object | No | Custom HTTP headers | `{"Content-Type": "application/json"}` |
| `queryParams` | Object | No | URL query parameters | `{"search": "term", "limit": 10}` |
| `body` | Object | No | Request body (POST/PUT/PATCH) | `{"title": "My Post", "content": "..."}` |

### Output Variables (Set after Service Task)

| Variable | Type | Description |
|----------|------|-------------|
| `success` | Boolean | `true` if request succeeded, `false` otherwise |
| `statusCode` | Number | HTTP status code (200, 404, 500, etc.) |
| `responseBody` | Object/String | Parsed JSON response or raw text |
| `responseHeaders` | Object | HTTP response headers |
| `error` | String/null | Error message if request failed, `null` otherwise |

## Troubleshooting

### Issue: "Missing required field: url"

**Cause**: The `url` process variable is not set or is empty.

**Solution**: Ensure the `url` variable is initialized before the Service Task:
```javascript
url = "https://api.example.com/endpoint"
```

### Issue: "Invalid HTTP method"

**Cause**: The `method` variable contains an invalid value.

**Solution**: Use one of: GET, POST, PUT, DELETE, PATCH (case-insensitive)

### Issue: Request returns 401 Unauthorized

**Cause**: API requires authentication but it's not configured in n8n.

**Solution**:
1. Open the n8n workflow
2. Configure authentication in the HTTP Request node
3. Save and reactivate the workflow

### Issue: "Connection refused" or "ENOTFOUND"

**Cause**: URL is incorrect or the API is not accessible from the n8n container.

**Solution**:
- Verify the URL is correct
- Check network connectivity from n8n container: `docker exec catalyst-n8n ping api.example.com`
- Ensure the API endpoint is accessible

### Issue: Response body is empty

**Cause**: Some APIs return empty responses for certain status codes (204 No Content, etc.)

**Solution**: Check the `statusCode` variable to understand the response. An empty `responseBody` with `statusCode = 204` is expected.

## Advanced Usage

### Conditional Requests

Use BPMN gateways to check the response:

```xml
<bpmn:exclusiveGateway id="Gateway_1" name="Request successful?">
  <bpmn:sequenceFlow id="Flow_Success" sourceRef="Gateway_1" targetRef="Task_Success">
    <bpmn:conditionExpression>${success == true}</bpmn:conditionExpression>
  </bpmn:sequenceFlow>
  <bpmn:sequenceFlow id="Flow_Error" sourceRef="Gateway_1" targetRef="Task_Error">
    <bpmn:conditionExpression>${success == false}</bpmn:conditionExpression>
  </bpmn:sequenceFlow>
</bpmn:exclusiveGateway>
```

### Dynamic URLs with Process Variables

You can reference process variables in the JSON payload using `${variableName}` syntax:

**Example: Dynamic User ID in URL**
```json
{
  "method": "GET",
  "url": "https://api.example.com/users/${userId}",
  "headers": {},
  "queryParams": {},
  "body": {}
}
```

If you have a process variable `userId = "123"`, this will make a request to: `https://api.example.com/users/123`

**Example: Dynamic Values in Request Body**
```json
{
  "method": "POST",
  "url": "https://api.example.com/posts",
  "headers": {},
  "queryParams": {},
  "body": {
    "title": "${postTitle}",
    "author": "${authorName}",
    "content": "${postContent}"
  }
}
```

This will substitute the process variables `postTitle`, `authorName`, and `postContent` into the request body.

## Files in this Connector

- `http-request.n8n.json` - n8n workflow definition
- `http-request.element.json` - Camunda Modeler element template
- `http-request.bpmn` - Example BPMN process demonstrating usage
- `README.md` - This documentation file

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section above
- Review the example BPMN process: `http-request.bpmn`
- Check n8n workflow execution logs for detailed error information

## License

Part of the Catalyst Connector project.
