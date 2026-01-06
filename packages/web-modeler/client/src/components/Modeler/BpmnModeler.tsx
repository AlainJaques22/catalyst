import { useCallback, useEffect, useMemo, useState } from 'react';
import { BpmnModeler } from '@miragon/camunda-web-modeler';
import type { BpmnPropertiesPanelOptions } from '@miragon/camunda-web-modeler/dist/editor/BpmnEditor';
import type { Event } from '@miragon/camunda-web-modeler/dist/events/Events';
import type { ContentSavedReason } from '@miragon/camunda-web-modeler/dist/events/modeler/ContentSavedEvent';
import { isContentSavedEvent } from '@miragon/camunda-web-modeler/dist/events/modeler/ContentSavedEvent';
import toast from 'react-hot-toast';
import { getFile, saveFile, deployToCamunda, getElementTemplates } from '../../services/api';
import './BpmnModeler.css';

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
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

interface BpmnModelerComponentProps {
  currentFile: string | null;
  onToolbarActions?: (actions: {
    handleSave: () => void;
    handleDeploy: () => void;
    handleDownload: () => void;
    handleRefreshTemplates: () => void;
    saving: boolean;
    deploying: boolean;
  }) => void;
}

export function BpmnModelerComponent({ currentFile, onToolbarActions }: BpmnModelerComponentProps) {
  const [xml, setXml] = useState<string>(EMPTY_BPMN);
  const [elementTemplates, setElementTemplates] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);

  // Load element templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await getElementTemplates();
      console.log(`Loaded ${response.data.templates.length} element templates`);
      setElementTemplates(response.data.templates);
    } catch (error) {
      console.error('Failed to load element templates:', error);
      toast.error('Failed to load connector templates');
    }
  };

  // Load file when currentFile changes
  useEffect(() => {
    if (currentFile) {
      loadFile(currentFile);
    } else {
      setXml(EMPTY_BPMN);
    }
  }, [currentFile]);

  const loadFile = async (filename: string) => {
    try {
      const response = await getFile(filename);
      setXml(response.data.xml);
      toast.success(`Loaded: ${filename}`);
    } catch (error) {
      console.error('Error loading file:', error);
      toast.error('Failed to load file');
    }
  };

  const handleSave = useCallback(async () => {
    if (!currentFile) {
      toast.error('No file selected');
      return;
    }

    try {
      setSaving(true);
      await saveFile(currentFile, xml);
      toast.success('Saved!');
    } catch (error) {
      toast.error('Failed to save');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  }, [currentFile, xml]);

  const handleDeploy = useCallback(async () => {
    if (!currentFile) {
      toast.error('No file selected');
      return;
    }

    try {
      setDeploying(true);
      const result = await deployToCamunda(currentFile, xml);
      toast.success(`Deployed: ${result.data.deploymentId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Deployment failed');
      console.error('Deploy error:', error);
    } finally {
      setDeploying(false);
    }
  }, [currentFile, xml]);

  const handleDownload = useCallback(async () => {
    if (!currentFile) {
      toast.error('No file selected');
      return;
    }

    try {
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Downloaded!');
    } catch (error) {
      toast.error('Failed to download');
    }
  }, [currentFile, xml]);

  const handleRefreshTemplates = useCallback(async () => {
    await loadTemplates();
    toast.success('Templates refreshed');
  }, []);

  // Expose toolbar actions to parent
  useEffect(() => {
    if (onToolbarActions) {
      onToolbarActions({
        handleSave,
        handleDeploy,
        handleDownload,
        handleRefreshTemplates,
        saving,
        deploying
      });
    }
  }, [saving, deploying, onToolbarActions, handleSave, handleDeploy, handleDownload, handleRefreshTemplates]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        handleDeploy();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleDeploy]);

  const onXmlChanged = useCallback((
    newXml: string,
    _newSvg: string | undefined,
    reason: ContentSavedReason
  ) => {
    console.debug(`Model changed: ${reason}`);
    setXml(newXml);
  }, []);

  const onEvent = useCallback(async (event: Event<any>) => {
    if (isContentSavedEvent(event)) {
      onXmlChanged(event.data.xml, event.data.svg, event.data.reason);
    }
  }, [onXmlChanged]);

  const propertiesPanelOptions: BpmnPropertiesPanelOptions = useMemo(() => ({
    elementTemplates: elementTemplates
  }), [elementTemplates]);

  return (
    <div className="modeler-container">
      <BpmnModeler
        xml={xml}
        onEvent={onEvent}
        modelerTabOptions={{
          propertiesPanelOptions: propertiesPanelOptions
        }}
      />
    </div>
  );
}
