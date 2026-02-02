import * as React from 'react';
import { SourceChooser } from '@web/components/sourceChooser';
import type { Source } from '@recorder/recorderTypes';
import './Toolbar.css';

interface ToolbarProps {
  mode: string;
  paused: boolean;
  isRecording: boolean;
  isInspecting: boolean;
  fileId: string;
  sources: Source[];
  sourceText?: string;
  onRecord: () => void;
  onInspect: () => void;
  onAssertVisibility: () => void;
  onAssertText: () => void;
  onAssertValue: () => void;
  onCopy: () => void;
  onResume: () => void;
  onPause: () => void;
  onStep: () => void;
  onClear: () => void;
  onFileChange: (fileId: string) => void;
  onViewToggle: () => void;
  showCodeView: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  paused,
  isRecording,
  isInspecting,
  fileId,
  sources,
  sourceText,
  onRecord,
  onInspect,
  onAssertVisibility,
  onAssertText,
  onAssertValue,
  onCopy,
  onResume,
  onPause,
  onStep,
  onClear,
  onFileChange,
  onViewToggle,
  showCodeView,
}) => {
  return (
    <div className="roost-toolbar">
      <div className="roost-toolbar-left">
        <button
          className={`roost-btn ${isRecording ? 'roost-btn-recording' : 'roost-btn-secondary'}`}
          onClick={onRecord}
          title="Record"
        >
          <span className="roost-btn-icon">⏺</span>
          <span className="roost-btn-text">Record</span>
        </button>
        <button
          className={`roost-btn ${isInspecting ? 'roost-btn-active' : 'roost-btn-secondary'}`}
          onClick={onInspect}
          title="Pick locator"
        >
          <span className="roost-btn-icon">🎯</span>
          <span className="roost-btn-text">Inspect</span>
        </button>
        <button
          className={`roost-btn ${mode === 'assertingVisibility' ? 'roost-btn-active' : 'roost-btn-secondary'}`}
          onClick={onAssertVisibility}
          disabled={mode === 'none' || mode === 'standby' || mode === 'inspecting'}
          title="Assert visibility"
        >
          <span className="roost-btn-icon">👁</span>
          <span className="roost-btn-text">Assert Visibility</span>
        </button>
        <button
          className={`roost-btn ${mode === 'assertingText' ? 'roost-btn-active' : 'roost-btn-secondary'}`}
          onClick={onAssertText}
          disabled={mode === 'none' || mode === 'standby' || mode === 'inspecting'}
          title="Assert text"
        >
          <span className="roost-btn-icon">T</span>
          <span className="roost-btn-text">Assert Text</span>
        </button>
        <button
          className={`roost-btn ${mode === 'assertingValue' ? 'roost-btn-active' : 'roost-btn-secondary'}`}
          onClick={onAssertValue}
          disabled={mode === 'none' || mode === 'standby' || mode === 'inspecting'}
          title="Assert value"
        >
          <span className="roost-btn-icon">V</span>
          <span className="roost-btn-text">Assert Value</span>
        </button>

        <div className="roost-toolbar-divider"></div>

        <button
          className="roost-btn roost-btn-icon-only"
          onClick={onCopy}
          disabled={!sourceText}
          title="Copy"
        >
          📋
        </button>
        <button
          className="roost-btn roost-btn-icon-only"
          onClick={onResume}
          disabled={!paused}
          title="Resume (F8)"
        >
          ▶️
        </button>
        <button
          className="roost-btn roost-btn-icon-only"
          onClick={onPause}
          disabled={paused}
          title="Pause (F8)"
        >
          ⏸
        </button>
        <button
          className="roost-btn roost-btn-icon-only"
          onClick={onStep}
          disabled={!paused}
          title="Step over (F10)"
        >
          ⏭
        </button>
        <button
          className="roost-btn roost-btn-icon-only"
          onClick={onClear}
          disabled={!sourceText}
          title="Clear"
        >
          🗑
        </button>
      </div>

      <div className="roost-toolbar-right">
        <span className="roost-target-label">Target:</span>
        <SourceChooser fileId={fileId} sources={sources} setFileId={onFileChange} />
        <button
          className="roost-btn roost-btn-secondary roost-btn-small"
          onClick={onViewToggle}
          title={showCodeView ? "Show Steps View" : "Show Code View"}
        >
          {showCodeView ? "📋 Steps" : "💻 Code"}
        </button>
      </div>
    </div>
  );
};
