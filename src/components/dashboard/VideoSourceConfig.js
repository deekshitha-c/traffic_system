import React, { useState } from 'react';

const VideoSourceConfig = ({ onSave, onCancel }) => {
  const [videoSources, setVideoSources] = useState({
    A: '',
    B: '',
    C: '',
    D: ''
  });

  const handleInputChange = (signal, value) => {
    setVideoSources(prev => ({
      ...prev,
      [signal]: value
    }));
  };

  const handleSave = () => {
    onSave(videoSources);
  };

  return (
    <div className="modal-content">
      <h2>Configure Video Sources</h2>
      <div className="video-source-config">
        {Object.entries(videoSources).map(([signal, source]) => (
          <div key={signal} className="video-source-input">
            <label>Signal {signal} Video Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => handleInputChange(signal, e.target.value)}
              placeholder="Enter video source URL or device ID"
            />
          </div>
        ))}
      </div>
      <div className="modal-actions">
        <button onClick={onCancel} className="control-btn gray">Cancel</button>
        <button onClick={handleSave} className="control-btn green">Save Configuration</button>
      </div>
    </div>
  );
};

export default VideoSourceConfig; 