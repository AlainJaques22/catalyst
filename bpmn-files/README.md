# Catalyst BPMN Files

This directory stores all BPMN diagrams created in the Catalyst Web Modeler.

## Features

- **Local Storage**: Your BPMN files are stored locally on your machine
- **File Explorer Access**: Browse files directly in Windows Explorer/File Manager
- **Easy Backup**: Simply copy this folder to backup your diagrams
- **Version Control**: Can be committed to git for version history
- **External Editing**: Edit BPMN files in VS Code or other XML editors

## File Structure

Each BPMN file follows the naming convention: `{process-name}.bpmn`

Example:
```
bpmn-files/
├── README.md
├── email-notification-process.bpmn
├── user-onboarding.bpmn
└── order-fulfillment.bpmn
```

## Docker Integration

This directory is bind-mounted to the web-modeler container at `/app/bpmn-files`.
Any changes made in the web modeler are immediately visible in this local directory.
