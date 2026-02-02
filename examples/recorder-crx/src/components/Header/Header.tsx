import * as React from 'react';
import './Header.css';

interface HeaderProps {
  recordingName: string;
  onRecordingNameChange: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ recordingName, onRecordingNameChange }) => {
  return (
    <div className="roost-header">
      <div className="roost-header-left">
        <img src="/logo192.png" alt="Roost" className="roost-logo" />
        <div className="roost-divider"></div>
        <input
          type="text"
          value={recordingName}
          onChange={(e) => onRecordingNameChange(e.target.value)}
          className="roost-recording-name"
          placeholder="Recording name"
        />
      </div>
      <div className="roost-header-right">
        <span className="roost-badge">Recording</span>
      </div>
    </div>
  );
};
