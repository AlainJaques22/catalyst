import { FloppyDisk, Rocket, Download, ArrowClockwise } from '@phosphor-icons/react';
import './Toolbar.css';

interface ToolbarProps {
  onSave: () => void;
  onDeploy: () => void;
  onDownload: () => void;
  onRefresh: () => void;
  saving?: boolean;
  deploying?: boolean;
  currentFile?: string | null;
}

export function Toolbar({
  onSave,
  onDeploy,
  onDownload,
  onRefresh,
  saving = false,
  deploying = false,
  currentFile
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <span className="current-file-name">
          {currentFile || 'Untitled.bpmn'}
        </span>
      </div>

      <div className="toolbar-section toolbar-actions">
        <button
          onClick={onSave}
          disabled={saving || !currentFile}
          title="Save (Ctrl+S)"
        >
          <FloppyDisk size={18} weight={saving ? 'fill' : 'regular'} />
          {saving ? 'Saving...' : 'Save'}
        </button>

        <button
          onClick={onDeploy}
          disabled={deploying || !currentFile}
          className="btn-deploy"
          title="Deploy to Camunda (Ctrl+D)"
        >
          <Rocket size={18} weight={deploying ? 'fill' : 'regular'} />
          {deploying ? 'Deploying...' : 'Deploy'}
        </button>

        <div className="toolbar-divider"></div>

        <button
          onClick={onDownload}
          disabled={!currentFile}
          title="Download BPMN file"
        >
          <Download size={18} />
          Download
        </button>

        <button
          onClick={onRefresh}
          title="Refresh element templates"
        >
          <ArrowClockwise size={18} />
          Refresh
        </button>
      </div>
    </div>
  );
}
