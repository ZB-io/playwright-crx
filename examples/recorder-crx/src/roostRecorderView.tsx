/**
 * Copyright (c) Rui Figueira.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import type { CallLog, Mode, Source } from '@recorder/recorderTypes';
import { CodeMirrorWrapper } from '@web/components/codeMirrorWrapper';
import type { SourceHighlight } from '@web/components/codeMirrorWrapper';
import { emptySource } from '@web/components/sourceChooser';
import { copy } from '@web/uiUtils';
import yaml from 'yaml';
import { parseAriaSnapshot } from '@isomorphic/ariaSnapshot';
import { Header } from './components/Header/Header';
import { Toolbar } from './components/Toolbar/Toolbar';
import { StepCard } from './components/StepCard/StepCard';
import { ErrorBanner } from './components/ErrorBanner/ErrorBanner';
import { convertToNaturalLanguage } from './utils/codeConverter';
import './roostRecorder.css';

export interface RoostRecorderViewProps {
  sources: Source[];
  log: Map<string, CallLog>;
  mode: Mode;
  paused: boolean;
  onEditedCode?: (code: string) => any;
  onCursorActivity?: (position: { line: number }) => any;
  onClose: () => void;
}

export const RoostRecorderView: React.FC<RoostRecorderViewProps> = ({
  sources,
  log,
  mode,
  paused,
  onClose,
}) => {
  const [selectedFileId, setSelectedFileId] = React.useState<string | undefined>();
  const [runningFileId, setRunningFileId] = React.useState<string | undefined>();
  const [recordingName, setRecordingName] = React.useState('new recording');
  const [showCodeView, setShowCodeView] = React.useState(false);
  const [ariaSnapshot, setAriaSnapshot] = React.useState<string | undefined>();
  const [ariaSnapshotErrors, setAriaSnapshotErrors] = React.useState<SourceHighlight[]>();
  const [selectorFocusOnChange, setSelectorFocusOnChange] = React.useState<boolean | undefined>(true);

  // Debug: Check if window.dispatch is available
  React.useEffect(() => {
    console.log('[RoostRecorder] Component mounted');
    console.log('[RoostRecorder] window.dispatch available:', typeof window.dispatch);
    console.log('[RoostRecorder] Initial mode:', mode);
    console.log('[RoostRecorder] Initial sources:', sources.length);
  }, []);

  // Debug: Log mode changes
  React.useEffect(() => {
    console.log('[RoostRecorder] Mode changed to:', mode);
  }, [mode]);

  // Debug: Log source changes
  React.useEffect(() => {
    console.log('[RoostRecorder] Sources updated, count:', sources.length);
    if (sources.length > 0) {
      console.log('[RoostRecorder] First source text length:', sources[0].text?.length || 0);
    }
  }, [sources]);

  // Theme detection
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const fileId = selectedFileId || runningFileId || sources[0]?.id;

  const source = React.useMemo(() => {
    if (fileId) {
      const source = sources.find(s => s.id === fileId);
      if (source)
        return source;
    }
    return emptySource();
  }, [sources, fileId]);

  const [locator, setLocator] = React.useState('');
  window.playwrightElementPicked = (elementInfo: any, userGesture?: boolean) => {
    const language = source.language;
    setLocator(elementInfo.selector);
    setAriaSnapshot(elementInfo.ariaSnapshot);
    setAriaSnapshotErrors([]);
    setSelectorFocusOnChange(userGesture);

    const isRecording = ['recording', 'assertingText', 'assertingVisibility', 'assertingValue', 'assertingSnapshot'].includes(mode);
    window.dispatch({ event: 'setMode', params: { mode: isRecording ? 'recording' : 'standby' } }).catch(() => { });
  };

  window.playwrightSetRunningFile = setRunningFileId;

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'center', inline: 'nearest' });
  }, [messagesEndRef]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'F8':
          event.preventDefault();
          if (paused)
            window.dispatch({ event: 'resume' });
          else
            window.dispatch({ event: 'pause' });
          break;
        case 'F10':
          event.preventDefault();
          if (paused)
            window.dispatch({ event: 'step' });
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [paused]);

  const onEditorChange = React.useCallback((selector: string) => {
    if (mode === 'none' || mode === 'inspecting')
      window.dispatch({ event: 'setMode', params: { mode: 'standby' } });
    setLocator(selector);
    window.dispatch({ event: 'highlightRequested', params: { selector } });
  }, [mode]);

  const onAriaEditorChange = React.useCallback((ariaSnapshot: string) => {
    if (mode === 'none' || mode === 'inspecting')
      window.dispatch({ event: 'setMode', params: { mode: 'standby' } });
    const { fragment, errors } = parseAriaSnapshot(yaml, ariaSnapshot, { prettyErrors: false });
    const highlights = errors.map(error => {
      const highlight: SourceHighlight = {
        message: error.message,
        line: error.range[1].line,
        column: error.range[1].col,
        type: 'subtle-error',
      };
      return highlight;
    });
    setAriaSnapshotErrors(highlights);
    setAriaSnapshot(ariaSnapshot);
    if (!errors.length)
      window.dispatch({ event: 'highlightRequested', params: { ariaTemplate: fragment } });
  }, [mode]);

  const isRecording = mode === 'recording' || mode === 'recording-inspecting';
  const isInspecting = mode === 'inspecting' || mode === 'recording-inspecting';

  const handleRecord = () => {
    const newMode = (mode === 'none' || mode === 'standby' || mode === 'inspecting') ? 'recording' : 'standby';
    console.log('[RoostRecorder] handleRecord called, current mode:', mode, '-> new mode:', newMode);
    console.log('[RoostRecorder] Calling window.dispatch with setMode');
    window.dispatch({ event: 'setMode', params: { mode: newMode } }).catch((err) => {
      console.error('[RoostRecorder] Error in window.dispatch:', err);
    });
  };

  const handleInspect = () => {
    const newMode = {
      'inspecting': 'standby',
      'none': 'inspecting',
      'standby': 'inspecting',
      'recording': 'recording-inspecting',
      'recording-inspecting': 'recording',
      'assertingText': 'recording-inspecting',
      'assertingVisibility': 'recording-inspecting',
      'assertingValue': 'recording-inspecting',
      'assertingSnapshot': 'recording-inspecting',
    }[mode];
    window.dispatch({ event: 'setMode', params: { mode: newMode } }).catch(() => { });
  };

  const handleAssertVisibility = () => {
    window.dispatch({ event: 'setMode', params: { mode: mode === 'assertingVisibility' ? 'recording' : 'assertingVisibility' } });
  };

  const handleAssertText = () => {
    window.dispatch({ event: 'setMode', params: { mode: mode === 'assertingText' ? 'recording' : 'assertingText' } });
  };

  const handleAssertValue = () => {
    window.dispatch({ event: 'setMode', params: { mode: mode === 'assertingValue' ? 'recording' : 'assertingValue' } });
  };

  const handleClear = () => {
    window.dispatch({ event: 'clear' });
  };

  const handleCopy = () => {
    copy(source.text);
  };

  const handleResume = () => {
    window.dispatch({ event: 'resume' }).catch(() => {});
  };

  const handlePause = () => {
    window.dispatch({ event: 'pause' }).catch(() => {});
  };

  const handleStep = () => {
    window.dispatch({ event: 'step' }).catch(() => {});
  };

  const handleFileChange = (fileId: string) => {
    setSelectedFileId(fileId);
    window.dispatch({ event: 'fileChanged', params: { file: fileId } });
  };

  // Extract steps from source code when log is empty (during recording)
  const stepsFromSource = React.useMemo(() => {
    if (!source.text) {
      console.log('[RoostRecorder] No source.text available');
      return [];
    }

    console.log('[RoostRecorder] Parsing source.text, length:', source.text.length);

    const lines = source.text.split('\n');
    const steps: Array<{id: string, title: string, line: string}> = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      // Skip imports, test declarations, and empty lines
      if (!trimmed ||
          trimmed.startsWith('import ') ||
          trimmed.startsWith('test(') ||
          trimmed.startsWith('//') ||
          trimmed === '}' ||
          trimmed === '});' ||
          trimmed === '{') {
        return;
      }

      // Extract meaningful steps - look for page interactions
      const isPlaywrightAction =
        trimmed.includes('await ') ||
        trimmed.includes('.goto(') ||
        trimmed.includes('.click(') ||
        trimmed.includes('.fill(') ||
        trimmed.includes('.press(') ||
        trimmed.includes('.check(') ||
        trimmed.includes('.uncheck(') ||
        trimmed.includes('.selectOption(') ||
        trimmed.includes('.hover(') ||
        trimmed.includes('page.') ||
        (trimmed.startsWith('await ') && trimmed.includes('page'));

      if (isPlaywrightAction) {
        const naturalLanguage = convertToNaturalLanguage(trimmed);
        console.log('[RoostRecorder] Found step:', naturalLanguage);
        steps.push({
          id: `step-${index}`,
          title: naturalLanguage,
          line: trimmed
        });
      }
    });

    console.log('[RoostRecorder] Total steps parsed:', steps.length);
    return steps;
  }, [source.text]);

  const logArray = React.useMemo(() => {
    return Array.from(log.values());
  }, [log]);

  // Check if there's an error in the log
  const errorStep = React.useMemo(() => {
    return logArray.find(step => step.status === 'error');
  }, [logArray]);

  const [showErrorBanner, setShowErrorBanner] = React.useState(false);

  React.useEffect(() => {
    setShowErrorBanner(!!errorStep);
  }, [errorStep]);

  const handleDismissError = () => {
    setShowErrorBanner(false);
  };

  const handleResumeFromError = () => {
    setShowErrorBanner(false);
    // Clear the error state and resume recording
    window.dispatch({ event: 'setMode', params: { mode: 'recording' } }).catch(() => {});
  };

  // Simple logic: use stepsFromSource always (it parses the generated code)
  const displaySteps = stepsFromSource;

  console.log('[RoostRecorder] mode:', mode, 'isRecording:', isRecording, 'displaySteps.length:', displaySteps.length, 'source.text length:', source.text?.length || 0);

  return (
    <div className="roost-recorder-container">
      <Header recordingName={recordingName} onRecordingNameChange={setRecordingName} />

      <Toolbar
        mode={mode}
        paused={paused}
        isRecording={isRecording}
        isInspecting={isInspecting}
        fileId={fileId}
        sources={sources}
        sourceText={source.text}
        onRecord={handleRecord}
        onInspect={handleInspect}
        onAssertVisibility={handleAssertVisibility}
        onAssertText={handleAssertText}
        onAssertValue={handleAssertValue}
        onCopy={handleCopy}
        onResume={handleResume}
        onPause={handlePause}
        onStep={handleStep}
        onClear={handleClear}
        onFileChange={handleFileChange}
        onViewToggle={() => setShowCodeView(!showCodeView)}
        showCodeView={showCodeView}
      />

      {showErrorBanner && errorStep && (
        <ErrorBanner
          message={errorStep.error || 'An error occurred during playback'}
          onDismiss={handleDismissError}
          onResume={handleResumeFromError}
        />
      )}

      <div className="roost-content">
        {showCodeView ? (
          <div className="roost-code-view">
            <CodeMirrorWrapper
              text={source.text}
              language={source.language}
              highlight={source.highlight}
              revealLine={source.revealLine}
              readOnly={source.isRecorded}
              lineNumbers={true}
              focusOnChange={false}
              wrapLines={true}
            />
          </div>
        ) : (
          <div className="roost-steps-view">
            {displaySteps.length === 0 ? (
              <div className="roost-empty-state">
                <p>Click Record to start capturing actions</p>
              </div>
            ) : (
              <>
                {displaySteps.map((step, index) => (
                  <StepCard key={'id' in step ? step.id : `step-${index}`} step={step} index={index} language={source.language} />
                ))}
              </>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        )}
      </div>

      <div className="roost-footer">
        <div className="roost-footer-tab">
          <span>close</span>
          <span className="roost-tab-icon">⟲</span>
        </div>
      </div>
    </div>
  );
};
