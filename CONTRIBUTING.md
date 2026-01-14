# Contributing to Catalyst Connector

Thank you for your interest in contributing!

<a href='https://ko-fi.com/Z8Z21RL1PI' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Getting Started

Thank you for contributing to Catalyst! Whether you're fixing bugs, adding features, or creating new connectors, this guide will help you get started.

### Development Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AlainJaques22/catalyst.git
   cd catalyst
   ```

2. **Start the development environment:**
   ```bash
   cd docker
   docker-compose up -d
   ```

3. **Access the services:**
   - Control Panel: http://localhost
   - Camunda Cockpit: http://localhost:8080/camunda
   - n8n: http://localhost:5678
   - BPMN Modeler: http://localhost/modeler

### Code Standards

- Follow existing code formatting and style
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation for any user-facing changes
- Keep changes focused and atomic

## Creating Connectors

Connectors are the heart of Catalyst. They bridge Camunda 7 processes with n8n's 400+ integrations.

### Connector Architecture

Each connector consists of three files:

1. **Element Template** (`{connector-name}.element.json`) - Camunda Modeler configuration
2. **BPMN Example** (`{connector-name}.bpmn`) - Demonstrates usage
3. **n8n Workflow** (`{connector-name}.n8n.json`) - Handles API calls and authentication

### Creating Your First Connector

1. **Read the specification:**

   Start with [CONNECTOR_SPEC.md](CONNECTOR_SPEC.md) to understand the requirements and patterns.

2. **Use the template:**

   Copy the example connector template from `connectors/templates/example-connector/` as a starting point.

3. **Build the n8n workflow:**

   - Create a webhook trigger node
   - Add HTTP request nodes for your API
   - Store credentials in n8n (NEVER in Camunda)
   - Format the response for Camunda
   - Export as JSON

4. **Create the element template:**

   - Define input parameters for your connector
   - Use plain JSON (no FEEL expressions)
   - Set the webhook URL to match the allowlist
   - Include output mapping for response data

5. **Document your connector:**

   Create a README.md with:
   - What the connector does
   - How to configure credentials in n8n
   - Example usage scenarios
   - Response data format

### Connector Security Requirements

Security is paramount when creating connectors. Follow these requirements:

#### Webhook URL Validation

All webhooks must use URLs that match the allowlist:

- **Development:** Use `http://localhost:5678/webhook/` or `http://catalyst-n8n:5678/webhook/`
- **Production:** Document any custom URL requirements in your connector README
- **Testing:** Always test with both valid and invalid webhook URLs

#### Credential Management

**NEVER store credentials in Camunda:**
- ❌ No API keys in process variables
- ❌ No passwords in BPMN payloads
- ❌ No tokens hardcoded in element templates

**Always store credentials in n8n:**
- ✅ Use n8n's credential manager
- ✅ Configure authentication in HTTP Request nodes
- ✅ Document credential setup in your README

#### Sensitive Data Handling

- Only pass non-sensitive business data from Camunda to n8n
- Sanitize and validate all user inputs
- Use HTTPS webhook URLs in production
- Document data flow and privacy implications

### Testing Your Connector

Before submitting, verify:

1. **Functional testing:**
   - Deploy to local Catalyst instance
   - Test with real API calls
   - Verify error handling
   - Check output mapping

2. **Security testing:**
   - Test webhook URL validation with invalid URLs
   - Verify no credentials in process variables
   - Test with malformed payloads
   - Check for data leakage in logs

3. **Documentation testing:**
   - Follow your own README instructions
   - Verify all examples work
   - Check for broken links
   - Ensure clear credential setup instructions

## Submitting Pull Requests

### Before You Submit

1. **Test thoroughly:**
   - Run all tests
   - Test your changes in a local Catalyst instance
   - Verify documentation is accurate

2. **Update documentation:**
   - Update relevant README files
   - Add entries to CHANGELOG.md
   - Update CONNECTOR_SPEC.md if introducing new patterns

3. **Follow security practices:**
   - No credentials in code or documentation
   - Webhook URLs match allowlist requirements
   - Security implications documented

### Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Keep commits focused and atomic
   - Write descriptive commit messages
   - Include "Co-Authored-By" for pair programming

3. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Open PR on GitHub
   - Fill out the PR template completely
   - Link related issues

4. **PR review:**
   - Address reviewer feedback
   - Keep the PR updated with main branch
   - Be responsive to questions

### Pull Request Checklist

- [ ] Code follows project style and conventions
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Security requirements met (webhook validation, credential handling)
- [ ] Connector includes all required files (element template, BPMN, n8n workflow, README)
- [ ] No credentials or secrets in code
- [ ] Examples tested and working
- [ ] PR description clearly explains changes

## Reporting Security Issues

If you discover a security vulnerability, please DO NOT open a public issue.

Instead, email security details to: [security contact needed]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow
- Celebrate contributions of all sizes

## Questions?

- Open a discussion on GitHub
- Check existing issues for similar questions
- Review the documentation in `/docs`
- Join our community (links coming soon)

## Recognition

All contributors will be recognized in our README. Significant contributions may earn you:

- Contributor badge
- Featured connector spotlight
- Early access to new features
- Direct communication channel with maintainers
