# Changelog

All notable changes to Catalyst will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Webhook URL validation security feature in CatalystBridge to prevent data exfiltration
- Environment variable `CATALYST_WEBHOOK_ALLOWLIST` for configuring allowed webhook URL prefixes
- Default allowlist includes `http://localhost:5678/webhook/`, `http://catalyst-n8n:5678/webhook/`, and `http://n8n:5678/webhook/`
- Comprehensive security documentation in bridge README
- Security guidelines in CONNECTOR_SPEC.md
- Detailed contributor security practices in CONTRIBUTING.md

### Security
- Webhook URLs are now validated against an allowlist before making HTTP requests
- SecurityException thrown with helpful error message when webhook URL validation fails
- Protection against malicious or misconfigured connectors attempting to send data to unauthorized endpoints

## [0.1.0] - 2025-01-10

### Added
- Initial release of Catalyst
- Unified control panel for managing Camunda 7 and n8n integration
- CatalystBridge Java delegate for routing Camunda tasks to n8n webhooks
- Docker-based all-in-one deployment
- Camunda 7 integration with PostgreSQL
- n8n integration with 400+ connectors
- Web-based BPMN modeler
- Connector builder for creating custom integrations
- Element template system for connector configuration
- Official connectors: HTTP Request, Send Email, Weather Forecast, IP Geolocation, Slack, xAI Text Analysis
- Live logs viewer with filtering
- Stats dashboard showing system activity
- Nginx reverse proxy for unified access
- Comprehensive documentation and connector specification

[Unreleased]: https://github.com/AlainJaques22/catalyst/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AlainJaques22/catalyst/releases/tag/v0.1.0
