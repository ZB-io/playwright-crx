import * as React from 'react';
import type { CallLog } from '@recorder/recorderTypes';
import { asLocator } from '@isomorphic/locatorGenerators';
import './StepCard.css';

interface StepCardProps {
  step: CallLog | { id: string; title: string; line: string };
  index: number;
  language: string;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index, language }) => {
  const isCallLog = 'params' in step;

  if (isCallLog) {
    const callLog = step as CallLog;
    const locatorText = callLog.params?.selector ? asLocator(language as any, callLog.params.selector) : null;

    return (
      <div
        key={callLog.id}
        className={`roost-step-card ${callLog.status === 'error' ? 'error' : ''} ${
          callLog.status === 'in-progress' ? 'in-progress' : ''
        }`}
      >
        <div className="roost-step-header">
          <div className="roost-step-number">{index + 1}</div>
          <div className="roost-step-title-wrapper">
            <div className="roost-step-action">{callLog.title || 'No title'}</div>
            {callLog.params?.url && (
              <div className="roost-step-target">{callLog.params.url}</div>
            )}
            {locatorText && !callLog.params?.url && (
              <div className="roost-step-target">{locatorText}</div>
            )}
          </div>
          <div className="roost-step-actions">
            <button className="roost-step-action-btn" title="Expand">
              ˅
            </button>
            <button className="roost-step-action-btn" title="Screenshot">
              📷
            </button>
          </div>
        </div>
        {callLog.messages && callLog.messages.length > 0 && (
          <div className="roost-step-details">
            {callLog.messages.map((msg, i) => (
              <div key={i} className="roost-step-message">
                {msg}
              </div>
            ))}
          </div>
        )}
        {callLog.error && <div className="roost-step-error">{callLog.error}</div>}
      </div>
    );
  } else {
    const sourceStep = step as { id: string; title: string; line: string };
    return (
      <div key={sourceStep.id} className="roost-step-card">
        <div className="roost-step-header">
          <div className="roost-step-number">{index + 1}</div>
          <div className="roost-step-title-wrapper">
            <div className="roost-step-action">{sourceStep.title}</div>
          </div>
          <div className="roost-step-actions">
            <button className="roost-step-action-btn" title="Expand">
              ˅
            </button>
            <button className="roost-step-action-btn" title="Screenshot">
              📷
            </button>
          </div>
        </div>
      </div>
    );
  }
};
