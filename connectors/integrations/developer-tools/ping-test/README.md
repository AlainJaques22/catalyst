# Catalyst Ping Test Connector

> **Test your Camunda ↔ n8n connectivity**

The Ping Test connector verifies that your Catalyst Bridge is correctly configured by sending a message from Camunda to n8n and receiving a response back.

---

## 📦 What's Included

```
ping-test/
├── ping-test.bpmn                  # BPMN process definition
├── ping-test.element.json          # Camunda Modeler element template
├── ping-test.n8n.json              # n8n webhook workflow
├── ping-test.html                  # Web-based test page
└── README.md                       # This file
```

---

## 🚀 Quick Start

### 1. Import n8n Workflow

1. Open your n8n instance at `http://localhost:5678`
2. Click **Workflows** → **Import from File**
3. Select `ping-test.n8n.json`
4. **Activate** the workflow

The webhook will be available at: `http://catalyst-n8n:5678/webhook/catalyst-ping-test`

### 2. Deploy BPMN Process

**Option A: Using Camunda Modeler**
1. Copy `ping-test.element.json` to your Modeler templates directory:
   - **Windows:** `%APPDATA%/camunda-modeler/resources/element-templates/`
   - **macOS:** `~/Library/Application Support/camunda-modeler/resources/element-templates/`
   - **Linux:** `~/.config/camunda-modeler/resources/element-templates/`
2. Open `ping-test.bpmn` in Camunda Modeler
3. Click **Deploy current diagram**

**Option B: Using REST API**
```bash
curl -X POST "http://localhost:8080/engine-rest/deployment/create" \
  -H "Content-Type: multipart/form-data" \
  -F "deployment-name=ping-test" \
  -F "data=@ping-test.bpmn"
```

### 3. Run the Test

**Using the Web Test Page** (Recommended):

1. The connectors are already served by your Catalyst Nginx container
2. Open in your browser:
   ```
   http://localhost/connectors/official/ping-test/ping-test.html
   ```

3. Enter your message (default: "Hello n8n")
4. Click **Run Test**
5. See the results in real-time!

**Alternatively, using Camunda Cockpit**:
1. Go to `http://localhost:8080/camunda/app/cockpit`
2. Navigate to **Processes** → **ping-test-example**
3. Click **Start Process Instance**
4. Add variable: `camundaMessage` = `"Hello n8n"`
5. Check **History** to see the results

---

## 🎯 How It Works

```
┌──────────────────────────────────────────────────────────────┐
│                      Test Flow                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User enters message in ping-test.html                    │
│     ↓                                                         │
│  2. JavaScript calls Camunda REST API                        │
│     POST /process-definition/key/ping-test-example/start     │
│     ↓                                                         │
│  3. Camunda starts process → executes Service Task           │
│     ↓                                                         │
│  4. CatalystBridge sends to n8n webhook:                     │
│     POST http://catalyst-n8n:5678/webhook/catalyst-ping-test │
│     Body: { "camundaMessage": "Hello n8n" }                  │
│     ↓                                                         │
│  5. n8n processes message:                                   │
│     n8nMessage = "n8n received this message from Camunda..." │
│     ↓                                                         │
│  6. n8n responds:                                            │
│     {                                                         │
│       "success": true,                                        │
│       "statusCode": 200,                                      │
│       "responseBody": {                                       │
│         "camundaMessage": "Hello n8n",                        │
│         "n8nMessage": "n8n received this message..."          │
│       }                                                       │
│     }                                                         │
│     ↓                                                         │
│  7. CatalystBridge maps output variables to Camunda          │
│     ↓                                                         │
│  8. Process completes                                        │
│     ↓                                                         │
│  9. Test page displays results with timeline                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Process Variables

**Input:**
| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `camundaMessage` | String | Yes | - | Your test message |

**Output:**
| Variable | Type | Description |
|----------|------|-------------|
| `success` | Boolean | Whether the request succeeded |
| `statusCode` | Number | HTTP status code (200 = success) |
| `n8nMessage` | String | Response from n8n |
| `error` | String | Error message (if failed) |

---

## 🧪 Expected Results

### ✅ Success Case
```
Input:  camundaMessage = "Hello n8n"

Output:
  success = true
  statusCode = 200
  n8nMessage = "n8n received this message from Camunda -> Hello n8n"
  error = null
```

### ❌ Common Failures

**n8n workflow not activated:**
```
Error: Connection refused
Solution: Activate the workflow in n8n
```

**Wrong webhook URL:**
```
statusCode = 404
Solution: Verify webhook URL matches: catalyst-ping-test
```

**BPMN not deployed:**
```
Error: Failed to start process: 404
Solution: Deploy ping-test.bpmn to Camunda
```

---

## 🔍 Troubleshooting

### Test page shows "Process timeout"
- ✅ Check n8n workflow is **activated**
- ✅ Verify webhook URL: `http://catalyst-n8n:5678/webhook/catalyst-ping-test`
- ✅ Check n8n logs: `docker logs catalyst-n8n`

### "Failed to start process: 404"
- ✅ Deploy BPMN to Camunda
- ✅ Verify process key is `ping-test-example`
- ✅ Check Camunda Cockpit for deployed processes

### CORS errors in browser
- ✅ Serve test page from a web server (not `file://`)
- ✅ Or add CORS headers to Camunda (development only)

---

## 🎨 Creating Tests for Other Connectors

The test framework is **reusable**! To create a test page for another connector:

### Step 1: Copy the Template
```bash
cp test.template.html ../your-connector/your-connector.html
```

### Step 2: Edit Configuration
```javascript
const config = {
    name: "Your Connector Name",
    processKey: "your-process-key",
    
    inputs: [
        {
            name: "yourVariable",
            label: "Your Input Label",
            default: "default value"
        }
    ],
    
    outputs: [
        { name: "success", label: "Success" },
        { name: "yourOutput", label: "Your Output" }
    ]
};
```

### Step 3: Done!
Open `your-connector.html` in browser. The test UI automatically adapts to your configuration.

**That's it - no copying JavaScript, no styling, just configuration!**

---

## 📚 Files Reference

### ping-test.bpmn
BPMN process definition with:
- Process key: `ping-test-example`
- Input variable: `camundaMessage`
- Output variables: `success`, `statusCode`, `n8nMessage`, `error`

### ping-test.element.json
Camunda Modeler element template for visual process design

### ping-test.n8n.json
n8n workflow that:
- Receives webhook from Camunda
- Processes the message
- Returns formatted response

### ping-test.html
Web-based test page powered by the shared `connector-test.js` library

---

## 📄 License

Part of the Catalyst Connector project.

---

**🎉 Happy Testing!**