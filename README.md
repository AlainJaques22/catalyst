<p align="center">
  <img src="docs/images/catalyst-logo.png" alt="Catalyst Bridge" width="200"/>
</p>

<h1 align="center">Catalyst Bridge</h1>

<p align="center">
  <strong>Bridge Camunda 7 to n8n's 400+ integrations.<br/>Enterprise workflow automation without the €80K/year price tag.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ELv2-blue.svg" alt="License: ELv2"></a>
  <a href="https://faircode.io"><img src="https://img.shields.io/badge/Fair%20Code-Yes-brightgreen" alt="Fair Code"></a>
  <a href="https://github.com/YOUR-USERNAME/catalyst/stargazers"><img src="https://img.shields.io/github/stars/YOUR-USERNAME/catalyst?style=social" alt="GitHub Stars"></a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-why-catalyst">Why Catalyst</a> •
  <a href="#-connectors">Connectors</a> •
  <a href="#-documentation">Docs</a> •
  <a href="#-support-this-project">Support</a>
</p>

---

> ⚠️ **Early Development** - Star & watch for updates! We're building in public and welcome feedback.

## 🤔 What is Catalyst?

Catalyst connects your **Camunda 7** BPMN processes to **n8n's** massive integration library. Get 400+ connectors (Slack, Salesforce, OpenAI, Google Sheets, and more) without migrating to Camunda 8.

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Camunda 7     │      │  Catalyst Bridge │      │      n8n        │
│   BPMN Process  │─────▶│   (Java Delegate)│─────▶│   400+ Apps     │
│                 │      │                  │      │   Slack, AI,    │
│   Service Task  │◀─────│   Webhooks       │◀─────│   Salesforce... │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

**How it works:**
1. Add a Catalyst connector to your BPMN service task
2. Configure it using the Camunda Modeler element template
3. Catalyst routes the request to your n8n webhook
4. n8n handles the integration (with your credentials stored securely)
5. Response flows back to your Camunda process

## 🎯 Why Catalyst?

### The Problem

You're running Camunda 7 and need integrations. Your options:

| Option | Pain |
|--------|------|
| **Migrate to Camunda 8** | €80,000+/year, massive migration project |
| **Build custom Java delegates** | Months of dev work, ongoing maintenance |
| **Use enterprise iPaaS** | Another €50K+ tool, vendor lock-in |

### The Solution

Catalyst gives you **enterprise-grade integrations at a fraction of the cost**:

| | Camunda 8 | Enterprise iPaaS | Catalyst |
|---|-----------|------------------|----------|
| **Connectors** | ~100-150 | Varies | **400+** (via n8n) |
| **Annual Cost** | €80,000+ | €50,000+ | **Self-hosted, free** |
| **Migration Required** | Full platform | New system | **Drop-in** |
| **Your Data** | Their cloud | Their cloud | **Your infrastructure** |
| **Credential Security** | Platform-managed | Platform-managed | **You control** |

## 📦 Connectors

### Available Now

| Connector | Status | Description |
|-----------|--------|-------------|
| 🔌 [Ping](connectors/integrations/ping/) | ✅ Ready | Test connectivity (hello world) |
| 💬 [Slack](connectors/integrations/slack/) | 🚧 Building | Send messages to channels/users |

### Coming Soon

| Connector | Priority | Use Case |
|-----------|----------|----------|
| 📊 Google Sheets | High | Read/write spreadsheet data |
| 🤖 OpenAI | High | AI-powered process automation |
| 📧 SendGrid | Medium | Transactional emails |
| 🏢 Salesforce | Medium | CRM integration |
| 📋 Jira | Medium | Issue tracking |

### Want a Connector?

[Open an issue](https://github.com/YOUR-USERNAME/catalyst/issues/new) or [contribute one](#-contributing)!

## 🚀 Quick Start

### Prerequisites

- Camunda 7 (7.15+)
- n8n (self-hosted or cloud)
- Docker & Docker Compose (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/catalyst.git
cd catalyst
```

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

This starts:
- Camunda 7 with Catalyst Bridge
- n8n with pre-configured webhooks
- PostgreSQL database

### 3. Open Camunda Modeler

1. Copy element templates from `modeler/resources/element-templates/` to your Modeler's template directory
2. Create a new BPMN diagram
3. Add a Service Task and select a Catalyst connector
4. Configure and deploy!

### 4. Configure n8n

1. Open n8n at `http://localhost:5678`
2. Import the workflow from `connectors/integrations/slack/slack.n8n.json`
3. Add your Slack credentials
4. Activate the workflow

See the [full documentation](docs/) for detailed setup instructions.

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/getting-started.md) | Full setup guide |
| [Connector Spec](CONNECTOR_SPEC.md) | How connectors are built |
| [Architecture](docs/architecture.md) | Technical deep-dive |
| [Contributing](CONTRIBUTING.md) | Build your own connector |

## 🤝 Contributing

We welcome contributions! Catalyst is designed to make connector development easy.

### Building a Connector

Each connector is just 4 files:

```
connectors/integrations/your-connector/
├── your-connector.element.json   # Camunda Modeler template
├── your-connector.n8n.json       # n8n workflow
├── your-connector.bpmn           # Example process
└── README.md                     # Documentation
```

See [CONNECTOR_SPEC.md](CONNECTOR_SPEC.md) for the full specification.

### Ways to Contribute

- 🐛 **Report bugs** - [Open an issue](https://github.com/YOUR-USERNAME/catalyst/issues)
- 💡 **Suggest features** - [Start a discussion](https://github.com/YOUR-USERNAME/catalyst/discussions)
- 🔌 **Build a connector** - See [Contributing Guide](CONTRIBUTING.md)
- 📖 **Improve docs** - PRs welcome!
- ⭐ **Star the repo** - Helps others find us

## 💖 Support This Project

Catalyst is free to use, but it takes significant time to build and maintain. If Catalyst saves your team from an expensive Camunda 8 migration, consider supporting development:

### Sponsor

<a href="https://github.com/sponsors/YOUR-USERNAME">
  <img src="https://img.shields.io/badge/GitHub%20Sponsors-Support%20Catalyst-ea4aaa?style=for-the-badge&logo=github-sponsors" alt="GitHub Sponsors">
</a>

<a href="https://ko-fi.com/YOUR-KOFI">
  <img src="https://img.shields.io/badge/Ko--fi-Buy%20me%20a%20coffee-ff5f5f?style=for-the-badge&logo=ko-fi" alt="Ko-fi">
</a>

### Sponsor Tiers

| Tier | Monthly | Perks |
|------|---------|-------|
| ☕ **Supporter** | $5 | Name in README, Discord access |
| 🚀 **Backer** | $25 | Above + vote on next connector, early access |
| 💎 **Sponsor** | $100 | Above + logo below, priority support |
| 🏢 **Enterprise** | $500 | Above + 1hr/mo consulting, custom connector priority |

### Sponsors

*Become the first sponsor! Your logo here.*

<!-- SPONSORS:START -->
<!-- SPONSORS:END -->

### Other Ways to Support

- ⭐ **Star this repository** - It really helps!
- 📣 **Share on LinkedIn/Twitter** - Spread the word
- 📝 **Write about Catalyst** - Blog posts, tutorials
- 🗣️ **Tell your colleagues** - Word of mouth matters

## 📜 License

Catalyst is [Fair Code](https://faircode.io) licensed under the [Elastic License 2.0 (ELv2)](LICENSE).

<details>
<summary><strong>What does this mean?</strong></summary>

### You CAN ✅

- **Self-host for free, forever** - No license fees, no usage limits
- **Use commercially** within your organization
- **Modify the source code** for your needs
- **Contribute improvements** back to the project

### You CANNOT ❌

- **Offer Catalyst as a hosted/managed service** to third parties
- **Resell Catalyst** as a product
- **Remove or obscure** licensing notices

### Why Fair Code?

We chose Fair Code to:
1. **Keep it free** for the companies and developers who use it
2. **Protect the project** from cloud vendors reselling our work
3. **Ensure sustainability** so we can keep improving Catalyst

This is the same approach used by [n8n](https://n8n.io), [Elastic](https://elastic.co), and [Grafana](https://grafana.com).

</details>

## 🗺️ Roadmap

### Phase 1: Foundation (Current)
- [x] Core bridge architecture
- [x] Connector specification
- [x] Ping connector (connectivity test)
- [ ] Slack connector
- [ ] Docker Compose setup
- [ ] Documentation

### Phase 2: Core Connectors
- [ ] Google Sheets
- [ ] OpenAI / ChatGPT
- [ ] SendGrid (Email)
- [ ] HTTP Request (generic)

### Phase 3: Enterprise
- [ ] Salesforce
- [ ] HubSpot
- [ ] Jira
- [ ] Microsoft Teams

### Phase 4: Community
- [ ] Connector contribution toolkit
- [ ] AI-powered connector generator
- [ ] Marketplace / registry

## 🙋 FAQ

<details>
<summary><strong>Why not just migrate to Camunda 8?</strong></summary>

Camunda 8 is excellent, but:
- Costs €80K+/year for enterprise features
- Requires significant migration effort
- Different execution model (Zeebe vs traditional)

If you're happy on Camunda 7 and just need integrations, Catalyst gives you that without the migration.
</details>

<details>
<summary><strong>Is this officially supported by Camunda?</strong></summary>

No. Catalyst is an independent open-source project. We're fans of Camunda, but this is a community effort.
</details>

<details>
<summary><strong>Where are my credentials stored?</strong></summary>

Your API keys and credentials are stored **only in n8n**, which you self-host. They never pass through Camunda or any external service. You maintain full control.
</details>

<details>
<summary><strong>Can I use this in production?</strong></summary>

Catalyst is in early development. We recommend testing thoroughly before production use. That said, the architecture is simple and reliable - it's essentially HTTP calls between Camunda and n8n.
</details>

<details>
<summary><strong>How is this different from Camunda 8 connectors?</strong></summary>

Camunda 8 connectors are tightly integrated with Zeebe and their cloud platform. Catalyst works with Camunda 7 and leverages n8n's mature connector ecosystem. Different approach, similar outcome.
</details>

## 📬 Contact

- **Issues/Bugs**: [GitHub Issues](https://github.com/YOUR-USERNAME/catalyst/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR-USERNAME/catalyst/discussions)
- **Twitter**: [@YOUR-TWITTER](https://twitter.com/YOUR-TWITTER)
- **Email**: catalyst@yourdomain.com

---

<p align="center">
  <strong>Built with ❤️ for the Camunda community</strong><br/>
  <sub>If Catalyst helps you, please consider <a href="https://github.com/sponsors/YOUR-USERNAME">sponsoring</a> or giving it a ⭐</sub>
</p>
