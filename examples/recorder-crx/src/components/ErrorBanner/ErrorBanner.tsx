import * as React from 'react';
import './ErrorBanner.css';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
  onResume: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss, onResume }) => {
  return (
    <div className="roost-error-banner">
      <div className="roost-error-content">
        <span className="roost-error-icon">⚠️</span>
        <div className="roost-error-text">
          <div className="roost-error-title">Playback Error</div>
          <div className="roost-error-message">{message}</div>
        </div>
      </div>
      <div className="roost-error-actions">
        <button className="roost-error-btn roost-error-btn-primary" onClick={onResume}>
          Resume Recording
        </button>
        <button className="roost-error-btn roost-error-btn-secondary" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
};
