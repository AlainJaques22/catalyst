package io.catalyst.bridge;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.util.Timeout;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Camunda 7 JavaDelegate for making HTTP POST requests to N8N webhook URLs.
 * <p>
 * Usage:
 * - Java Class: io.catalyst.bridge.CatalystConnector
 * - Delegate Expression: ${catalystConnector} (recommended for Spring Boot/Camunda Run)
 * <p>
 * Input Parameters:
 * - webhookUrl (required): The N8N webhook endpoint URL
 * - payload (optional): JSON payload to send as String or Map
 * - timeout (optional): Request timeout in seconds (default 30)
 * - headers (optional): Additional HTTP headers as Map<String, String>
 * - outputMapping (optional): JSON string mapping response fields to process variables
 * <p>
 * Output Variables:
 * - n8nResponse: The response body as String
 * - n8nStatusCode: HTTP status code (Integer)
 * - n8nSuccess: Boolean indicating if request was successful (2xx status)
 * - Additional variables defined in outputMapping
 */
@Component("catalystConnector")
public class CatalystBridge implements JavaDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(CatalystBridge.class);
    private static final String WEBHOOK_URL_PARAM = "webhookUrl";
    private static final String PAYLOAD_PARAM = "payload";
    private static final String TIMEOUT_PARAM = "timeout";
    private static final String HEADERS_PARAM = "headers";
    private static final String OUTPUT_MAPPING_PARAM = "outputMapping";

    private static final String RESPONSE_VAR = "n8nResponse";
    private static final String STATUS_CODE_VAR = "n8nStatusCode";
    private static final String SUCCESS_VAR = "n8nSuccess";

    private static final int DEFAULT_TIMEOUT_SECONDS = 30;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /**
     * Result holder for webhook HTTP response.
     */
    private static class WebhookResult {
        final String response;
        final int statusCode;
        final boolean success;

        WebhookResult(String response, int statusCode, boolean success) {
            this.response = response;
            this.statusCode = statusCode;
            this.success = success;
        }
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        // Print banner at start of execution
        printExecutionBanner(execution);

        try {
            // Get and validate webhook URL
            String webhookUrl = getRequiredParameter(execution, WEBHOOK_URL_PARAM);
            LOGGER.debug("Webhook URL: {}", webhookUrl);

            // Get payload (REQUIRED - no auto-build!)
            Object payloadObj = execution.getVariable(PAYLOAD_PARAM);

            if (payloadObj == null) {
                throw new IllegalArgumentException(
                    "Payload is required. Template must define a 'payload' input parameter.");
            }

            // Get optional parameters
            Integer timeout = getTimeoutParameter(execution);
            Map<String, String> headers = getHeadersParameter(execution);

            // Make HTTP request
            WebhookResult result = makeHttpRequest(webhookUrl, payloadObj, timeout, headers);

            // Store response in process variables
            execution.setVariable(RESPONSE_VAR, result.response);
            execution.setVariable(STATUS_CODE_VAR, result.statusCode);
            execution.setVariable(SUCCESS_VAR, result.success);

            // Apply output mapping if configured
            String outputMapping = (String) execution.getVariable(OUTPUT_MAPPING_PARAM);
            if (outputMapping != null && !outputMapping.trim().isEmpty()) {
                applyOutputMapping(execution, result.response, outputMapping);
            }

            LOGGER.info("Successfully executed Catalyst Connector webhook call for process instance: {}",
                execution.getProcessInstanceId());

        } catch (Exception e) {
            LOGGER.error("Error executing Catalyst Connector webhook call for process instance: {}",
                execution.getProcessInstanceId(), e);

            // Set error state in variables
            execution.setVariable(SUCCESS_VAR, false);
            execution.setVariable(RESPONSE_VAR, e.getMessage());
            execution.setVariable(STATUS_CODE_VAR, 0);

            throw e;
        }
    }

    /**
     * Prints a banner at the start of each execution for easy log separation
     */
    private void printExecutionBanner(DelegateExecution execution) {
        String processInstanceId = execution.getProcessInstanceId();
        String webhookUrl = (String) execution.getVariable(WEBHOOK_URL_PARAM);
        String timeout = execution.getVariable(TIMEOUT_PARAM) != null
            ? execution.getVariable(TIMEOUT_PARAM).toString() + "s"
            : "30s";

        // Truncate webhook URL if too long (keep it under 60 chars)
        if (webhookUrl != null && webhookUrl.length() > 60) {
            webhookUrl = "..." + webhookUrl.substring(webhookUrl.length() - 57);
        }

        String banner = "\n" +
            "+--------------------------------------------------------------------------+\n" +
            "| CATALYST BRIDGE                                                          |\n" +
            "+--------------------------------------------------------------------------+\n" +
            "| Process: " + formatBannerLine(processInstanceId != null ? processInstanceId : "N/A", 63) + "|\n" +
            "| Webhook: " + formatBannerLine(webhookUrl != null ? webhookUrl : "N/A", 63) + "|\n" +
            "| Timeout: " + formatBannerLine(timeout, 63) + "|\n" +
            "+--------------------------------------------------------------------------+";

        LOGGER.info(banner);
    }

    /**
     * Formats a string to fit within the banner with proper padding
     */
    private String formatBannerLine(String text, int width) {
        return String.format("%-" + width + "s", text);
    }

    /**
     * Makes the HTTP POST request to the webhook URL.
     */
    private WebhookResult makeHttpRequest(String webhookUrl, Object payload, int timeoutSeconds,
                                          Map<String, String> headers) throws Exception {

        RequestConfig requestConfig = RequestConfig.custom()
            .setConnectTimeout(Timeout.of(timeoutSeconds, TimeUnit.SECONDS))
            .setResponseTimeout(Timeout.of(timeoutSeconds, TimeUnit.SECONDS))
            .build();

        try (CloseableHttpClient httpClient = HttpClients.custom()
                .setDefaultRequestConfig(requestConfig)
                .build()) {

            HttpPost httpPost = new HttpPost(webhookUrl);

            // Set payload if provided
            if (payload != null) {
                Object jsonObject = prepareJsonPayload(payload);
                String jsonPayload = OBJECT_MAPPER.writeValueAsString(jsonObject);
                StringEntity entity = new StringEntity(jsonPayload, ContentType.APPLICATION_JSON);
                httpPost.setEntity(entity);
                LOGGER.debug("Request payload: {}", jsonPayload);
            }

            // Set default headers (can be overridden by custom headers)
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("Accept", "application/json");

            // Set custom headers if provided
            if (headers != null) {
                headers.forEach(httpPost::setHeader);
            }

            LOGGER.info("Sending POST request to: {}", webhookUrl);

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                int statusCode = response.getCode();
                String responseBody = response.getEntity() != null
                    ? EntityUtils.toString(response.getEntity())
                    : "";

                LOGGER.info("Received response with status code: {}", statusCode);
                LOGGER.debug("Response body: {}", responseBody);

                // Determine success based on 2xx status codes
                boolean success = statusCode >= 200 && statusCode < 300;

                if (!success) {
                    LOGGER.warn("N8N webhook returned non-success status code: {}", statusCode);
                }

                return new WebhookResult(responseBody, statusCode, success);
            }
        }
    }

    /**
     * Prepares the payload as a proper JSON object for serialization.
     * If payload is a JSON string, parse it first. Otherwise, use it directly.
     * Handles conversion of Scala collections to Java collections.
     *
     * @param payload The payload object (String, Map, or other)
     * @return Object ready for JSON serialization
     * @throws Exception if JSON parsing fails
     */
    private Object prepareJsonPayload(Object payload) throws Exception {
        if (payload instanceof String) {
            try {
                return OBJECT_MAPPER.readValue((String) payload, Object.class);
            } catch (Exception e) {
                LOGGER.debug("Payload string is not valid JSON, using as plain string");
                return payload;
            }
        }

        // Convert Scala collections to Java collections for proper JSON serialization
        // This is necessary because Camunda Platform (Tomcat) passes FEEL objects as Scala Maps,
        // while Camunda Run (Spring Boot) wraps them in JavaCollections$MapWrapper
        return convertScalaToJava(payload);
    }

    /**
     * Recursively converts Scala collections to Java collections.
     * Uses reflection to avoid compile-time dependency on Scala libraries.
     *
     * @param obj The object to convert
     * @return Java-compatible object (Map, List, or primitive)
     */
    private Object convertScalaToJava(Object obj) {
        if (obj == null) {
            return null;
        }

        String className = obj.getClass().getName();

        // Check if it's a Scala Map (camundajar.impl.scala.collection.immutable.Map or similar)
        if (className.contains("scala.collection") && className.contains("Map")) {
            try {
                // Use reflection to call JavaConverters.mapAsJavaMap
                // Camunda uses shaded Scala with package prefix "camundajar.impl."
                Class<?> scalaMapClass = Class.forName("camundajar.impl.scala.collection.Map");
                Class<?> javaConvertersClass = Class.forName("camundajar.impl.scala.collection.JavaConverters$");
                Object moduleInstance = javaConvertersClass.getField("MODULE$").get(null);
                java.lang.reflect.Method method = javaConvertersClass.getMethod("mapAsJavaMap", scalaMapClass);

                @SuppressWarnings("unchecked")
                java.util.Map<Object, Object> javaMap = (java.util.Map<Object, Object>) method.invoke(moduleInstance, obj);

                // Recursively convert map values
                java.util.Map<Object, Object> convertedMap = new java.util.HashMap<>();
                for (java.util.Map.Entry<Object, Object> entry : javaMap.entrySet()) {
                    convertedMap.put(
                        convertScalaToJava(entry.getKey()),
                        convertScalaToJava(entry.getValue())
                    );
                }

                LOGGER.debug("Converted Scala Map to Java Map: {}", className);
                return convertedMap;

            } catch (Exception e) {
                LOGGER.warn("Failed to convert Scala Map to Java Map: {}", e.getMessage());
                return obj;
            }
        }

        // Check if it's a Scala Seq/List
        if (className.contains("scala.collection") && (className.contains("Seq") || className.contains("List"))) {
            try {
                // Get the Scala Seq interface class dynamically
                // Camunda uses shaded Scala with package prefix "camundajar.impl."
                Class<?> scalaSeqClass = Class.forName("camundajar.impl.scala.collection.Seq");
                Class<?> javaConvertersClass = Class.forName("camundajar.impl.scala.collection.JavaConverters$");
                Object moduleInstance = javaConvertersClass.getField("MODULE$").get(null);
                java.lang.reflect.Method method = javaConvertersClass.getMethod("seqAsJavaList", scalaSeqClass);

                @SuppressWarnings("unchecked")
                java.util.List<Object> javaList = (java.util.List<Object>) method.invoke(moduleInstance, obj);

                // Recursively convert list elements
                java.util.List<Object> convertedList = new java.util.ArrayList<>();
                for (Object element : javaList) {
                    convertedList.add(convertScalaToJava(element));
                }

                LOGGER.debug("Converted Scala Seq/List to Java List: {}", className);
                return convertedList;

            } catch (Exception e) {
                LOGGER.warn("Failed to convert Scala Seq/List to Java List: {}", e.getMessage());
                return obj;
            }
        }

        // For primitive types and already-Java objects, return as-is
        return obj;
    }

    /**
     * Gets a required parameter from the execution context.
     */
    private String getRequiredParameter(DelegateExecution execution, String paramName) {
        Object value = execution.getVariable(paramName);
        if (value == null || value.toString().trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Required parameter '" + paramName + "' is missing or empty");
        }
        return value.toString();
    }

    /**
     * Gets the timeout parameter or returns default.
     */
    private Integer getTimeoutParameter(DelegateExecution execution) {
        Object timeoutObj = execution.getVariable(TIMEOUT_PARAM);
        if (timeoutObj == null) {
            return DEFAULT_TIMEOUT_SECONDS;
        }

        try {
            if (timeoutObj instanceof Number) {
                return ((Number) timeoutObj).intValue();
            } else {
                return Integer.parseInt(timeoutObj.toString());
            }
        } catch (NumberFormatException e) {
            LOGGER.warn("Invalid timeout value: {}, using default: {}",
                timeoutObj, DEFAULT_TIMEOUT_SECONDS);
            return DEFAULT_TIMEOUT_SECONDS;
        }
    }

    /**
     * Gets the headers parameter as a Map.
     */
    @SuppressWarnings("unchecked")
    private Map<String, String> getHeadersParameter(DelegateExecution execution) {
        Object headersObj = execution.getVariable(HEADERS_PARAM);
        if (headersObj == null) {
            return null;
        }

        if (headersObj instanceof Map) {
            return (Map<String, String>) headersObj;
        }

        if (headersObj instanceof String) {
            try {
                return OBJECT_MAPPER.readValue((String) headersObj, Map.class);
            } catch (Exception e) {
                LOGGER.warn("Failed to parse headers JSON string, ignoring headers", e);
            }
        } else {
            LOGGER.warn("Headers parameter is not a Map or JSON string, ignoring");
        }

        return null;
    }

    /**
     * Applies output mapping to extract fields from JSON response and set as process variables.
     *
     * @param execution The execution context
     * @param jsonResponse The JSON response body
     * @param mappingJson The output mapping configuration as JSON string
     */
    @SuppressWarnings("unchecked")
    private void applyOutputMapping(DelegateExecution execution, String jsonResponse, String mappingJson) {
        try {
            // Parse the mapping configuration
            Map<String, String> mappings = OBJECT_MAPPER.readValue(mappingJson, Map.class);

            // Parse the response JSON
            com.fasterxml.jackson.databind.JsonNode responseNode = OBJECT_MAPPER.readTree(jsonResponse);

            // Apply each mapping
            for (Map.Entry<String, String> mapping : mappings.entrySet()) {
                String variableName = mapping.getKey();
                String jsonPath = mapping.getValue();

                try {
                    Object value = extractValueFromJsonPath(responseNode, jsonPath);
                    execution.setVariable(variableName, value);
                    LOGGER.debug("Mapped variable: {} = {}", variableName, value);
                } catch (Exception e) {
                    LOGGER.warn("Failed to extract value for variable '{}' using path '{}': {}",
                        variableName, jsonPath, e.getMessage());
                    execution.setVariable(variableName, null);
                }
            }

        } catch (Exception e) {
            LOGGER.warn("Output mapping failed: {}", e.getMessage());
        }
    }

    /**
     * Extracts a value from a JSON node using a simple JSON path.
     * Supports paths like "$.field", "$.parent.child.field", and "$.array[0].field[1]".
     *
     * @param rootNode The root JSON node
     * @param jsonPath The JSON path (e.g., "$.field", "$.parent.child", "$.output[0].content[0].text")
     * @return The extracted value, or null if path doesn't exist
     */
    private Object extractValueFromJsonPath(com.fasterxml.jackson.databind.JsonNode rootNode, String jsonPath) {
        // Remove leading "$." if present
        String path = jsonPath.startsWith("$.") ? jsonPath.substring(2) : jsonPath;

        // Split path into segments
        String[] segments = path.split("\\.");

        // Navigate through the JSON structure
        com.fasterxml.jackson.databind.JsonNode currentNode = rootNode;
        for (String segment : segments) {
            if (currentNode == null || currentNode.isNull()) {
                LOGGER.warn("Node is null at segment: '{}' in path: '{}'", segment, jsonPath);
                return null;
            }

            // Check if segment contains array index notation like "field[0]"
            if (segment.contains("[") && segment.contains("]")) {
                currentNode = processArraySegment(currentNode, segment);
            } else {
                currentNode = currentNode.get(segment);
            }

            if (currentNode == null) {
                LOGGER.warn("Failed to navigate to segment: '{}' in path: '{}'", segment, jsonPath);
                return null;
            }
        }

        return convertJsonNodeToValue(currentNode);
    }

    /**
     * Processes a segment containing array index notation like "field[0]" or "arr[1][2]".
     *
     * @param node The current JSON node
     * @param segment The segment containing field and array indices (e.g., "output[0]" or "data[1][2]")
     * @return The node after navigating through field and array indices, or null if navigation fails
     */
    private com.fasterxml.jackson.databind.JsonNode processArraySegment(
            com.fasterxml.jackson.databind.JsonNode node, String segment) {

        // Extract field name (everything before first '[')
        int firstBracket = segment.indexOf('[');
        String fieldName = segment.substring(0, firstBracket);

        // Get the field first
        com.fasterxml.jackson.databind.JsonNode currentNode = node.get(fieldName);

        if (currentNode == null) {
            LOGGER.warn("Field '{}' not found in segment '{}'", fieldName, segment);
            return null;
        }

        // Extract all array indices from the segment (e.g., "[0][1]" -> [0, 1])
        String indicesString = segment.substring(firstBracket);
        String[] indexParts = indicesString.split("\\[");

        // Process each array index
        for (String indexPart : indexParts) {
            if (indexPart.isEmpty()) {
                continue;
            }

            String indexStr = indexPart.replace("]", "").trim();

            try {
                int index = Integer.parseInt(indexStr);

                if (!currentNode.isArray()) {
                    LOGGER.warn("Node is not an array in segment '{}', cannot access index {}", segment, index);
                    return null;
                }

                if (index < 0 || index >= currentNode.size()) {
                    LOGGER.warn("Array index {} out of bounds (size: {}) in segment '{}'",
                        index, currentNode.size(), segment);
                    return null;
                }

                currentNode = currentNode.get(index);

            } catch (NumberFormatException e) {
                LOGGER.warn("Invalid array index '{}' in segment '{}'", indexStr, segment);
                return null;
            }

            if (currentNode == null) {
                LOGGER.warn("Array access returned null in segment '{}'", segment);
                return null;
            }
        }

        return currentNode;
    }
    /**
     * Converts a JsonNode to an appropriate Java value.
     *
     * @param node The JSON node to convert
     * @return The converted value
     */
    private Object convertJsonNodeToValue(com.fasterxml.jackson.databind.JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        } else if (node.isTextual()) {
            return node.asText();
        } else if (node.isInt()) {
            return node.asInt();
        } else if (node.isLong()) {
            return node.asLong();
        } else if (node.isDouble() || node.isFloat()) {
            return node.asDouble();
        } else if (node.isBoolean()) {
            return node.asBoolean();
        } else if (node.isArray()) {
            // Convert JSON array to Java List
            List<Object> list = new ArrayList<>();
            for (com.fasterxml.jackson.databind.JsonNode element : node) {
                list.add(convertJsonNodeToValue(element)); // Recursively convert elements
            }
            return list;
        } else if (node.isObject()) {
            // For complex objects, return as JSON string
            return node.toString();
        } else {
            return node.asText();
        }
    }
}
