import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FileBrowser } from './components/FileBrowser/FileBrowser';
import { NewFileDialog } from './components/FileBrowser/NewFileDialog';
import { BpmnModelerComponent } from './components/Modeler/BpmnModeler';
import './App.css';

interface ToolbarActions {
  handleSave: () => void;
  handleDeploy: () => void;
  handleDownload: () => void;
  handleRefreshTemplates: () => void;
  saving: boolean;
  deploying: boolean;
}

function App() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [toolbarActions, setToolbarActions] = useState<ToolbarActions | null>(null);

  const handleFileSelect = (filename: string) => {
    setCurrentFile(filename);
  };

  const handleFileCreated = (filename: string) => {
    setCurrentFile(filename);
    // Force file browser to refresh (it will happen automatically via useEffect)
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Catalyst BPMN Modeler</h1>
          <p className="header-subtitle">Design and deploy process diagrams with Catalyst connectors</p>
        </div>
      </header>

      <div className="app-content">
        <FileBrowser
          currentFile={currentFile}
          onFileSelect={handleFileSelect}
          onNewFile={() => setShowNewFileDialog(true)}
          toolbarActions={toolbarActions}
        />

        <BpmnModelerComponent
          currentFile={currentFile}
          onToolbarActions={setToolbarActions}
        />
      </div>

      {showNewFileDialog && (
        <NewFileDialog
          onClose={() => setShowNewFileDialog(false)}
          onFileCreated={handleFileCreated}
        />
      )}

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '0.875rem'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            },
            duration: 6000
          }
        }}
      />
    </div>
  );
}

export default App;
