import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { saveFile } from '../../services/api';
import './NewFileDialog.css';

const EMPTY_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" name="New Process" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Start" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

interface NewFileDialogProps {
  onClose: () => void;
  onFileCreated: (filename: string) => void;
}

export function NewFileDialog({ onClose, onFileCreated }: NewFileDialogProps) {
  const [filename, setFilename] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filename.trim()) {
      toast.error('Please enter a filename');
      return;
    }

    const fullFilename = filename.endsWith('.bpmn') ? filename : `${filename}.bpmn`;

    setCreating(true);
    try {
      await saveFile(fullFilename, EMPTY_BPMN);
      toast.success(`Created ${fullFilename}`);
      onFileCreated(fullFilename);
      onClose();
    } catch (error: any) {
      console.error('Error creating file:', error);
      toast.error(error.response?.data?.error || 'Failed to create file');
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>New BPMN Diagram</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            <label htmlFor="filename">
              Diagram Name
            </label>
            <input
              id="filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="my-process"
              autoFocus
              disabled={creating}
            />
            <p className="input-hint">
              File will be saved as <strong>{filename || 'my-process'}.bpmn</strong>
            </p>
          </div>

          <div className="dialog-footer">
            <button type="button" onClick={onClose} disabled={creating}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
