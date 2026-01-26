# Gmail Connector

Gmail integration connector

## Overview

This is a multi-operation connector that supports:
- **Resources**: Draft, Label, Message, Thread
- **Total Operations**: 15

## Setup Instructions

### 1. Import Element Template (Camunda Modeler)

1. Open Camunda Modeler
2. Go to File → Import Element Template
3. Select `gmail.element.json`
4. Template "Catalyst - Gmail Connector" is now available

### 2. Import n8n Workflow Template

1. Open n8n (http://localhost:5678)
2. Go to Workflows → Import from File
3. Select `gmail-template.n8n.json`
4. Opens a template workflow with Webhook → Gmail → Response

### 3. Configure Gmail Node in n8n

1. Click on the Gmail node
2. **Select Resource**: Choose from dropdown
   - Draft: 1 operations
   - Label: 3 operations
   - Message: 6 operations
   - Thread: 5 operations
3. **Select Operation**: Dropdown shows operations for selected resource
4. **Configure fields**: n8n shows only relevant fields for your operation
   - Variables already mapped: `{{ $json.body.paramName }}`
5. **Add Credentials**: Configure OAuth/API credentials
6. **Save workflow** and **Activate**

### 4. Use in Camunda BPMN

1. Create/open a BPMN diagram
2. Add a Service Task
3. Click "Apply Template" → Select "Catalyst - Gmail Connector"
4. Configure in properties panel:
   - **Resource**: Select resource type
   - **Operation**: Select operation (fields change based on selection)
   - **Parameters**: Configure operation-specific parameters
5. Deploy and execute process

## Supported Operations

### Draft (1 operations)
- **Delete**: Delete a draft

### Label (3 operations)
- **Delete**: Delete a label
- **Get**: Get a label info
- **Get Many**: Get many labels

### Message (6 operations)
- **Add Label**: Add label to message
- **Delete**: Delete a message
- **Mark as Read**: Mark a message as read
- **Mark as Unread**: Mark a message as unread
- **Remove Label**: Remove label from message
- **Send and Wait for Response**: Send message and wait for response

### Thread (5 operations)
- **Add Label**: Add label to thread
- **Delete**: Delete a thread
- **Remove Label**: Remove label from thread
- **Trash**: Trash a thread
- **Untrash**: Untrash a thread

## Need Multiple Operations?

If you need both "send" and "get" operations:
1. Duplicate the n8n workflow
2. Configure first copy for "send"
3. Configure second copy for "get"
4. Save with descriptive names

The element template supports all operations - you just need to set up n8n workflows for the operations you need.

---

🤖 Generated with Catalyst Connector Generator v2.0
