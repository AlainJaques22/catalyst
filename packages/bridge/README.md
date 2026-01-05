# Catalyst Bridge

The core Java delegate that enables Camunda 7 to call webhooks.


## Features

- Simple HTTP POST integration with N8N webhooks
- Configurable timeout and custom headers
- Flexible payload handling (JSON string or Map)
- Comprehensive error handling and logging
- Process variable outputs for response handling

## Quick Start

1. **Deploy the JAR** to Camunda Run's `configuration/userlib/` directory
2. **Create a BPMN process** in Camunda Modeler
3. **Add a Service Task** with:
   - Implementation: `Java Class`
   - Java Class: `io.catalyst.camunda.catalystconnector.CatalystConnector`
   - Input parameter `webhookUrl`: Your N8N webhook URL
4. **Deploy and start** your process

That's it! The connector will POST to your N8N webhook.

## Installation

### Scenario 1: Camunda Run (Standalone) - Recommended

This is the simplest deployment option. Camunda Run is the standalone distribution of Camunda 7.

1. Build the JAR:
   ```bash
   mvn clean package
   ```

2. Copy the JAR to Camunda Run's userlib directory:
   ```bash
   cp target/catalyst-connector-1.0.0-SNAPSHOT.jar <CAMUNDA_RUN>/configuration/userlib/
   ```

3. Restart Camunda Run

4. Use the **Java Class** approach in your BPMN processes (see Usage section below)

### Scenario 2: Spring Boot Embedded Engine

For custom Spring Boot applications with an embedded Camunda engine.

Add as a Maven dependency:

```xml
<dependency>
    <groupId>io.catalyst</groupId>
    <artifactId>catalyst-connector</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

The connector will auto-register as a Spring bean named `catalystConnector`, allowing you to use either the **Java Class** approach or the **Delegate Expression** approach (`${catalystConnector}`).

### Scenario 3: Tomcat/Wildfly

Add the JAR to your Camunda deployment's `lib` folder:
```bash
cp target/catalyst-connector-1.0.0-SNAPSHOT.jar <CAMUNDA_HOME>/lib/
```

Use the **Java Class** approach in your BPMN processes.

## Usage

### Service Task Configuration

Configure a Service Task in your BPMN process using the Java Class implementation:

```xml
<serviceTask id="callN8nWebhook" name="Call N8N Webhook"
             camunda:class="io.catalyst.camunda.catalystconnector.CatalystConnector">
  <extensionElements>
    <camunda:inputOutput>
      <camunda:inputParameter name="webhookUrl">https://your-n8n-instance.com/webhook/your-webhook-id</camunda:inputParameter>
      <camunda:inputParameter name="payload">
        <camunda:map>
          <camunda:entry key="processId">${execution.getProcessInstanceId()}</camunda:entry>
          <camunda:entry key="businessKey">${execution.getProcessBusinessKey()}</camunda:entry>
          <camunda:entry key="status">approved</camunda:entry>
        </camunda:map>
      </camunda:inputParameter>
      <camunda:inputParameter name="timeout">60</camunda:inputParameter>
      <camunda:inputParameter name="headers">
        <camunda:map>
          <camunda:entry key="X-Custom-Header">CustomValue</camunda:entry>
          <camunda:entry key="Authorization">Bearer ${apiToken}</camunda:entry>
        </camunda:map>
      </camunda:inputParameter>
    </camunda:inputOutput>
  </extensionElements>
</serviceTask>
```

**Note for Spring Boot Users**: If using an embedded Camunda engine in Spring Boot, you can alternatively use Delegate Expression `${catalystConnector}` instead of the Java Class. Change `camunda:class="io.catalyst.camunda.catalystconnector.CatalystConnector"` to `camunda:delegateExpression="${catalystConnector}"`.

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `webhookUrl` | String | Yes | - | The N8N webhook endpoint URL |
| `payload` | String/Map | No | null | JSON payload to send. Can be a JSON string or a Map object |
| `timeout` | Integer | No | 30 | Request timeout in seconds |
| `headers` | Map/String | No | null | Additional HTTP headers as Map or JSON string |
| `outputMapping` | String | No | null | JSON mapping to extract response fields as process variables |

### Output Variables

The delegate sets the following process variables:

| Variable | Type | Description |
|----------|------|-------------|
| `n8nResponse` | String | The response body from N8N |
| `n8nStatusCode` | Integer | HTTP status code (200, 404, 500, etc.) |
| `n8nSuccess` | Boolean | `true` if status code is 2xx, `false` otherwise |
| *Custom variables* | Various | Additional variables defined in `outputMapping` parameter |

### Example: Using Response in Gateway

```xml
<serviceTask id="callN8nWebhook" name="Call N8N"
             camunda:class="io.catalyst.camunda.catalystconnector.CatalystConnector">
  <!-- input parameters here -->
</serviceTask>

<exclusiveGateway id="checkResponse" name="Check Response" />

<sequenceFlow sourceRef="callN8nWebhook" targetRef="checkResponse" />

<sequenceFlow sourceRef="checkResponse" targetRef="successPath">
  <conditionExpression xsi:type="tFormalExpression">
    ${n8nSuccess == true}
  </conditionExpression>
</sequenceFlow>

<sequenceFlow sourceRef="checkResponse" targetRef="errorPath">
  <conditionExpression xsi:type="tFormalExpression">
    ${n8nSuccess == false}
  </conditionExpression>
</sequenceFlow>
```

### Example: Payload as JSON String

```xml
<camunda:inputParameter name="payload">
  <![CDATA[
  {
    "orderId": "${orderId}",
    "customer": "${customerName}",
    "total": ${orderTotal}
  }
  ]]>
</camunda:inputParameter>
```

### Example: Using Script to Build Payload

```xml
<camunda:inputParameter name="payload">
  <camunda:script scriptFormat="javascript">
    var data = {
      processId: execution.getProcessInstanceId(),
      variables: {}
    };

    // Add all process variables
    var vars = execution.getVariables();
    for (var key in vars) {
      data.variables[key] = vars[key];
    }

    JSON.stringify(data);
  </camunda:script>
</camunda:inputParameter>
```

### Example: Output Mapping

Extract specific fields from the N8N JSON response and set them as process variables.

**N8N Response:**
```json
{
  "sentiment": "positive",
  "confidence": 0.95,
  "data": {
    "summary": "Customer loves the product"
  }
}
```

**BPMN Configuration:**
```xml
<serviceTask id="callN8nWebhook" name="Call N8N Webhook"
             camunda:class="io.catalyst.camunda.catalystconnector.CatalystConnector">
  <extensionElements>
    <camunda:inputOutput>
      <camunda:inputParameter name="webhookUrl">https://your-n8n-instance.com/webhook/sentiment-analysis</camunda:inputParameter>
      <camunda:inputParameter name="payload">
        <camunda:map>
          <camunda:entry key="text">${customerFeedback}</camunda:entry>
        </camunda:map>
      </camunda:inputParameter>
      <camunda:inputParameter name="outputMapping">
        <![CDATA[
        {
          "sentiment": "$.sentiment",
          "confidenceScore": "$.confidence",
          "summary": "$.data.summary"
        }
        ]]>
      </camunda:inputParameter>
    </camunda:inputOutput>
  </extensionElements>
</serviceTask>
```

**Result:** Process variables created:
- `sentiment` = "positive"
- `confidenceScore` = 0.95
- `summary` = "Customer loves the product"
- `n8nResponse` = (full JSON string)
- `n8nStatusCode` = 200
- `n8nSuccess` = true

**Supported JSON Path Syntax:**
- Simple field: `$.fieldName`
- Nested field: `$.parent.child.grandchild`
- If a path doesn't exist, the variable is set to `null`

**Data Type Handling:**
- Strings, numbers, booleans: Converted to appropriate Java types
- Objects and arrays: Converted to JSON string representation

## Error Handling

When an error occurs:
- An exception is thrown (can be caught by Camunda's error boundary events)
- `n8nSuccess` is set to `false`
- `n8nResponse` contains the error message
- `n8nStatusCode` is set to `0`

### Example: Error Boundary Event

```xml
<serviceTask id="callN8nWebhook" name="Call N8N"
             camunda:class="io.catalyst.camunda.catalystconnector.CatalystConnector">
  <!-- input parameters -->
</serviceTask>

<boundaryEvent id="errorBoundary" attachedToRef="callN8nWebhook">
  <errorEventDefinition />
</boundaryEvent>

<sequenceFlow sourceRef="errorBoundary" targetRef="handleError" />
```

## N8N Webhook Setup

In N8N, create a webhook node with these settings:

1. **HTTP Method**: POST
2. **Path**: Choose a unique path (e.g., `/camunda-callback`)
3. **Authentication**: Configure as needed (Bearer token, Basic auth, etc.)
4. **Response**: Configure what data to return to Camunda

Example N8N webhook response:

```json
{
  "status": "success",
  "message": "Data processed",
  "workflowId": "abc-123",
  "timestamp": "2025-12-17T10:30:00Z"
}
```

## Troubleshooting

### ClassNotFoundException
- Ensure the JAR is in `configuration/userlib/` directory
- Restart Camunda Run completely
- Check the JAR file size is ~4.2MB (not a few KB)

### Camunda Run won't start after adding JAR
- Remove the JAR from userlib
- Check Camunda Run logs for conflicts
- Ensure you're using the correct shaded JAR with relocated dependencies

### "Cannot resolve identifier 'catalystConnector'"
- You're trying to use Delegate Expression in Camunda Run standalone
- Use Java Class approach instead (recommended for Camunda Run)
- Delegate Expression only works reliably with Spring Boot embedded engine

### Webhook call times out
- Check the `timeout` parameter (default 30 seconds)
- Verify the N8N webhook URL is accessible from Camunda
- Check N8N logs for errors

## Compatibility

| Catalyst Connector | Camunda Version | Java Version |
|-------------------|-----------------|--------------|
| 1.0.0-SNAPSHOT    | 7.21.0 - 7.24.0 | 11+          |

## Logging

The delegate uses SLF4J for logging. Configure your logging framework to see debug logs:

```properties
# Logback/Log4j configuration
io.catalyst.camunda.catalystconnector.CatalystConnector=DEBUG
```

Log messages include:
- Process instance IDs
- Webhook URLs (at DEBUG level)
- Request/response payloads (at DEBUG level)
- Status codes and success indicators
- Error messages with stack traces

## Technical Details

### JAR Contents

The JAR is approximately **4.2MB** and contains:
- The connector class (`CatalystConnector`)
- Apache HttpClient 5.3 and all its dependencies
- Jackson 2.16.1 for JSON processing

### Package Relocation (Shading)

The maven-shade-plugin relocates (renames) the packages of bundled dependencies to prevent classpath conflicts:
- HttpClient: `org.apache.hc.*` → `io.catalyst.shaded.hc.*`
- Jackson: `com.fasterxml.jackson.*` → `io.catalyst.shaded.jackson.*`

This allows the connector to use its own versions of these libraries without interfering with versions used by Camunda Run or other libraries in the classpath.

### Dependencies

**Bundled in JAR** (with package relocation):
- Apache HttpClient 5.3 and dependencies
- Jackson Databind 2.16.1

**Provided by Camunda Run** (not bundled):
- Camunda BPM Engine 7.21.0+
- SLF4J 2.x (logging)
- Spring Framework 6.x (optional, for bean registration)

## Testing

Run tests with:

```bash
mvn test
```

All 14 unit tests verify the connector's functionality including HTTP requests, payload handling, timeout configuration, and error handling.

## License

This project is part of the Catalyst platform.

## Contributing

Contributions are welcome! Please ensure tests pass before submitting pull requests.

## Support

For issues and questions, please contact the Catalyst development team.
