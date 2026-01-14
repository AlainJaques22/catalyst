/**
 * Catalyst Connector Test Library
 * Shared library for testing all Catalyst connectors
 * 
 * Usage:
 *   <script src="../test-lib/connector-test.js"></script>
 *   <script>
 *     new CatalystTest('container-id', {
 *       name: "Connector Name",
 *       processKey: "process-key",
 *       camundaUrl: "http://localhost:8080/engine-rest",
 *       inputs: [...],
 *       outputs: [...]
 *     });
 *   </script>
 */

class CatalystTest {
  constructor(containerId, config) {
    this.config = config;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      throw new Error(`Container element '${containerId}' not found`);
    }
    
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg-primary: #0a0f1a;
          --bg-secondary: #111827;
          --bg-card: #1a2234;
          --bg-card-hover: #1f2943;
          --border-color: #2d3a52;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --accent-primary: #3b82f6;
          --accent-secondary: #2563eb;
          --accent-cyan: #06b6d4;
          --accent-purple: #8b5cf6;
          --status-green: #10b981;
          --status-amber: #f59e0b;
          --status-red: #ef4444;
          --status-green-bg: rgba(16, 185, 129, 0.15);
          --status-red-bg: rgba(239, 68, 68, 0.15);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg-primary);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: var(--text-primary);
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        .catalyst-container {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          max-width: 700px;
          width: 100%;
          overflow: hidden;
        }

        .catalyst-header {
          background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%);
          padding: 32px;
          color: white;
          text-align: center;
          position: relative;
        }

        .catalyst-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .catalyst-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .catalyst-header p {
          opacity: 0.9;
          font-size: 15px;
          position: relative;
          z-index: 1;
        }

        .catalyst-content {
          padding: 32px;
          background: var(--bg-card);
        }

        .catalyst-section {
          margin-bottom: 24px;
        }

        .catalyst-section-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .catalyst-form-group {
          margin-bottom: 16px;
        }

        .catalyst-label {
          display: block;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 6px;
          font-size: 14px;
        }

        .catalyst-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .catalyst-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
          background: var(--bg-card);
        }

        .catalyst-input::placeholder {
          color: var(--text-muted);
        }

        .catalyst-button {
          background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
        }

        .catalyst-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.35);
        }

        .catalyst-button:active {
          transform: translateY(0);
        }

        .catalyst-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .catalyst-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .catalyst-results {
          margin-top: 24px;
          padding: 20px;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          border-left: 4px solid var(--accent-cyan);
        }

        .catalyst-results.success {
          border-left-color: var(--status-green);
          background: var(--status-green-bg);
        }

        .catalyst-results.error {
          border-left-color: var(--status-red);
          background: var(--status-red-bg);
        }

        .catalyst-result-header {
          margin-bottom: 16px;
        }

        .catalyst-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }

        .catalyst-badge.success {
          background: var(--status-green-bg);
          color: var(--status-green);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .catalyst-badge.error {
          background: var(--status-red-bg);
          color: var(--status-red);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .catalyst-result-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .catalyst-result-item:last-child {
          border-bottom: none;
        }

        .catalyst-result-label {
          font-weight: 600;
          color: var(--text-muted);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .catalyst-result-value {
          font-family: 'JetBrains Mono', 'Monaco', 'Courier New', monospace;
          color: var(--text-primary);
          font-size: 13px;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        .catalyst-timeline {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .catalyst-timeline-item {
          font-size: 12px;
          color: var(--text-secondary);
          padding: 6px 0;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .catalyst-timeline-time {
          color: var(--text-muted);
          font-family: 'JetBrains Mono', 'Monaco', monospace;
          min-width: 80px;
          font-size: 11px;
        }

        .catalyst-info {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-left: 4px solid var(--accent-primary);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      </style>
      
      <div class="catalyst-container">
        <div class="catalyst-header">
          <h1>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            ${this.config.name}
          </h1>
          <p>Test your Camunda ↔ n8n connectivity</p>
        </div>
        
        <div class="catalyst-content">
          <div class="catalyst-info">
            This test verifies your Catalyst Bridge by starting a Camunda process, 
            sending data to n8n via webhook, and displaying the response.
          </div>
          
          <div class="catalyst-section">
            <div class="catalyst-section-title">Configuration</div>
            <div class="catalyst-form-group">
              <label class="catalyst-label">Camunda REST API URL</label>
              <input 
                type="text" 
                class="catalyst-input" 
                id="camundaUrl" 
                value="${this.config.camundaUrl}"
              />
            </div>
          </div>
          
          <div class="catalyst-section">
            <div class="catalyst-section-title">Test Inputs</div>
            <div id="inputFields"></div>
          </div>
          
          <button class="catalyst-button" id="runButton">
            🚀 Run Test
          </button>
          
          <div id="results"></div>
        </div>
      </div>
    `;
    
    this.renderInputs();
    this.attachEventListeners();
  }
  
  renderInputs() {
    const container = document.getElementById('inputFields');
    container.innerHTML = this.config.inputs.map(input => `
      <div class="catalyst-form-group">
        <label class="catalyst-label">${input.label}</label>
        <input 
          type="text" 
          class="catalyst-input" 
          id="input-${input.name}"
          value="${input.default || ''}"
          placeholder="${input.placeholder || ''}"
        />
      </div>
    `).join('');
  }
  
  attachEventListeners() {
    document.getElementById('runButton').addEventListener('click', () => this.runTest());
    
    // Allow Enter key to submit
    this.config.inputs.forEach(input => {
      const el = document.getElementById(`input-${input.name}`);
      el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.runTest();
      });
    });
  }
  
  async runTest() {
    const button = document.getElementById('runButton');
    const resultsDiv = document.getElementById('results');
    
    // Get input values
    const camundaUrl = document.getElementById('camundaUrl').value;
    const variables = {};
    
    for (const input of this.config.inputs) {
      const value = document.getElementById(`input-${input.name}`).value;
      if (!value && input.required !== false) {
        this.showError(`Please enter ${input.label}`);
        return;
      }
      variables[input.name] = value;
    }
    
    // Disable button and show loading
    button.disabled = true;
    button.innerHTML = '<span class="catalyst-spinner"></span> Running test...';
    resultsDiv.innerHTML = '';
    
    const timeline = [];
    const startTime = Date.now();
    
    try {
      // Step 1: Start process
      this.addTimeline(timeline, 'Starting process...');
      const processInstance = await this.startProcess(camundaUrl, variables);
      this.addTimeline(timeline, `Process started: ${processInstance.id}`);
      
      // Step 2: Wait for completion
      this.addTimeline(timeline, 'Waiting for completion...');
      const completion = await this.waitForCompletion(camundaUrl, processInstance.id);
      this.addTimeline(timeline, `Process completed in ${completion.duration}ms`);
      
      // Step 3: Get output variables
      this.addTimeline(timeline, 'Fetching output variables...');
      const outputVars = await this.getProcessVariables(camundaUrl, processInstance.id);
      this.addTimeline(timeline, 'Test completed successfully!');
      
      const duration = Date.now() - startTime;
      
      // Display results
      this.displayResults({
        success: outputVars.success === true || outputVars.success === 'true',
        processInstanceId: processInstance.id,
        duration: duration,
        output: outputVars,
        timeline: timeline
      });
      
    } catch (error) {
      this.addTimeline(timeline, `Error: ${error.message}`);
      this.displayResults({
        success: false,
        error: error.message,
        timeline: timeline
      });
    } finally {
      button.disabled = false;
      button.innerHTML = '🚀 Run Test';
    }
  }
  
  async startProcess(camundaUrl, variables) {
    const url = `${camundaUrl}/process-definition/key/${this.config.processKey}/start`;
    
    // Convert to Camunda format
    const camundaVars = {};
    for (const [key, value] of Object.entries(variables)) {
      camundaVars[key] = {
        value: value,
        type: 'String'
      };
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variables: camundaVars,
        withVariablesInReturn: true
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to start process: ${response.status} - ${error}`);
    }
    
    return await response.json();
  }
  
  async waitForCompletion(camundaUrl, processInstanceId, maxAttempts = 60) {
    for (let i = 0; i < maxAttempts; i++) {
      const url = `${camundaUrl}/history/process-instance/${processInstanceId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to query process: ${response.status}`);
      }
      
      const instance = await response.json();
      
      if (instance.endTime) {
        return {
          completed: true,
          duration: instance.durationInMillis
        };
      }
      
      await this.sleep(500);
    }
    
    throw new Error('Process timeout after 30 seconds');
  }
  
  async getProcessVariables(camundaUrl, processInstanceId) {
    const url = `${camundaUrl}/history/variable-instance?processInstanceId=${processInstanceId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to get variables: ${response.status}`);
    }
    
    const variables = await response.json();
    const result = {};
    
    for (const variable of variables) {
      result[variable.name] = variable.value;
    }
    
    return result;
  }
  
  displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const cssClass = results.success ? 'success' : 'error';
    const badge = results.success 
      ? '<span class="catalyst-badge success">✓ Success</span>'
      : '<span class="catalyst-badge error">✗ Failed</span>';
    
    let html = `
      <div class="catalyst-results ${cssClass}">
        <div class="catalyst-result-header">${badge}</div>
    `;
    
    if (results.processInstanceId) {
      html += `
        <div class="catalyst-result-item">
          <span class="catalyst-result-label">Process Instance ID</span>
          <span class="catalyst-result-value">${results.processInstanceId}</span>
        </div>
      `;
    }
    
    if (results.duration) {
      html += `
        <div class="catalyst-result-item">
          <span class="catalyst-result-label">Duration</span>
          <span class="catalyst-result-value">${results.duration}ms</span>
        </div>
      `;
    }
    
    // Display configured outputs
    if (results.output) {
      for (const output of this.config.outputs) {
        const value = results.output[output.name];
        if (value !== undefined && value !== null) {
          html += `
            <div class="catalyst-result-item">
              <span class="catalyst-result-label">${output.label}</span>
              <span class="catalyst-result-value">${this.formatValue(value)}</span>
            </div>
          `;
        }
      }
    }
    
    if (results.error) {
      html += `
        <div class="catalyst-result-item">
          <span class="catalyst-result-label">Error</span>
          <span class="catalyst-result-value" style="color: #dc2626;">${results.error}</span>
        </div>
      `;
    }
    
    // Timeline
    if (results.timeline && results.timeline.length > 0) {
      html += `
        <div class="catalyst-timeline">
          <div class="catalyst-section-title">Execution Timeline</div>
      `;
      
      results.timeline.forEach(item => {
        html += `
          <div class="catalyst-timeline-item">
            <span class="catalyst-timeline-time">${item.time}</span>
            <span>${item.message}</span>
          </div>
        `;
      });
      
      html += `</div>`;
    }
    
    html += `</div>`;
    resultsDiv.innerHTML = html;
  }
  
  showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
      <div class="catalyst-results error">
        <div class="catalyst-result-header">
          <span class="catalyst-badge error">✗ Error</span>
        </div>
        <div class="catalyst-result-item">
          <span class="catalyst-result-value" style="color: #dc2626; width: 100%; max-width: 100%;">
            ${message}
          </span>
        </div>
      </div>
    `;
  }
  
  addTimeline(timeline, message) {
    timeline.push({
      time: new Date().toLocaleTimeString(),
      message: message
    });
  }
  
  formatValue(value) {
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
