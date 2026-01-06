import { useEffect, useState } from 'react';
import { Files, Plus, Trash, MagnifyingGlass, FloppyDisk, Rocket, Download, ArrowsClockwise } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { getFiles, deleteFile } from '../../services/api';
import type { FileMetadata } from '../../services/api';
import './FileBrowser.css';

interface ToolbarActions {
  handleSave: () => void;
  handleDeploy: () => void;
  handleDownload: () => void;
  handleRefreshTemplates: () => void;
  saving: boolean;
  deploying: boolean;
}

interface FileBrowserProps {
  currentFile: string | null;
  onFileSelect: (filename: string) => void;
  onNewFile: () => void;
  toolbarActions?: ToolbarActions | null;
}

export function FileBrowser({ currentFile, onFileSelect, onNewFile, toolbarActions }: FileBrowserProps) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await getFiles();
      setFiles(response.data.files);
    } catch (error) {
      toast.error('Failed to load files');
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (filename: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!confirm(`Delete "${filename}"?`)) return;

    try {
      await deleteFile(filename);
      toast.success('File deleted');
      await loadFiles();

      if (currentFile === filename) {
        onFileSelect('');
      }
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Error deleting file:', error);
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="file-browser">
      <div className="file-browser-header">
        <div className="header-title">
          <Files size={20} weight="duotone" />
          <h2>BPMN Files</h2>
        </div>
        <button className="btn-new-file primary" onClick={onNewFile}>
          <Plus size={16} weight="bold" />
          New
        </button>
      </div>

      <div className="file-search">
        <MagnifyingGlass size={16} />
        <input
          type="search"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="file-list">
        {loading ? (
          <div className="file-list-empty">
            <p>Loading files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="file-list-empty">
            {searchTerm ? (
              <p>No files match "{searchTerm}"</p>
            ) : (
              <>
                <Files size={48} weight="duotone" />
                <p>No BPMN files yet</p>
                <button className="primary" onClick={onNewFile}>
                  <Plus size={16} />
                  Create your first diagram
                </button>
              </>
            )}
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.name}
              className={`file-item ${currentFile === file.name ? 'active' : ''}`}
              onClick={() => onFileSelect(file.name)}
            >
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">
                  {formatFileSize(file.size)} • {formatDate(file.modified)}
                </div>
              </div>
              <button
                className="btn-delete danger"
                onClick={(e) => handleDelete(file.name, e)}
                title="Delete file"
              >
                <Trash size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="file-browser-footer">
        <div className="file-count">
          {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
        </div>
      </div>

      {/* Toolbar actions */}
      {toolbarActions && currentFile && (
        <div className="sidebar-toolbar">
          <div className="toolbar-section">
            <h3>Actions</h3>
            <button
              className="toolbar-btn primary"
              onClick={toolbarActions.handleSave}
              disabled={toolbarActions.saving}
            >
              <FloppyDisk size={18} weight="duotone" />
              <span>{toolbarActions.saving ? 'Saving...' : 'Save'}</span>
              <kbd>Ctrl+S</kbd>
            </button>
            <button
              className="toolbar-btn success"
              onClick={toolbarActions.handleDeploy}
              disabled={toolbarActions.deploying || !currentFile}
            >
              <Rocket size={18} weight="duotone" />
              <span>{toolbarActions.deploying ? 'Deploying...' : 'Deploy'}</span>
              <kbd>Ctrl+D</kbd>
            </button>
            <button
              className="toolbar-btn secondary"
              onClick={toolbarActions.handleDownload}
            >
              <Download size={18} weight="duotone" />
              <span>Download</span>
            </button>
            <button
              className="toolbar-btn secondary"
              onClick={toolbarActions.handleRefreshTemplates}
            >
              <ArrowsClockwise size={18} weight="duotone" />
              <span>Refresh Templates</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
