import React, { useState, useEffect } from 'react';

const VideoSourceConfig = ({ onSave, onCancel, initialSources = {} }) => {
  const [videoSources, setVideoSources] = useState({
    A: '',
    B: '',
    C: '',
    D: ''
  });

  const [sourceTypes, setSourceTypes] = useState({
    A: 'url',
    B: 'url',
    C: 'url',
    D: 'url'
  });

  // Initialize with saved sources when component mounts
  useEffect(() => {
    if (initialSources) {
      setVideoSources(initialSources);
      // Determine source types based on the initial values
      const types = {};
      Object.entries(initialSources).forEach(([signal, source]) => {
        types[signal] = source.startsWith('blob:') ? 'file' : 'url';
      });
      setSourceTypes(types);
    }
  }, [initialSources]);

  const handleInputChange = (signal, value) => {
    setVideoSources(prev => ({
      ...prev,
      [signal]: value
    }));
  };

  const handleSourceTypeChange = (signal, type) => {
    setSourceTypes(prev => ({
      ...prev,
      [signal]: type
    }));
    // Clear the source when switching types
    setVideoSources(prev => ({
      ...prev,
      [signal]: ''
    }));
  };

  const handleFileSelect = (signal, event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a local URL for the selected file
      const fileUrl = URL.createObjectURL(file);
      setVideoSources(prev => ({
        ...prev,
        [signal]: fileUrl
      }));
    }
  };

  const handleRemoveSource = (signal) => {
    setVideoSources(prev => ({
      ...prev,
      [signal]: ''
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
            <div className="source-header">
              <label>Signal {signal} Video Source</label>
              {source && (
                <button
                  onClick={() => handleRemoveSource(signal)}
                  className="remove-btn"
                  title="Remove source"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="source-type-selector">
              <button
                className={`type-btn ${sourceTypes[signal] === 'url' ? 'active' : ''}`}
                onClick={() => handleSourceTypeChange(signal, 'url')}
              >
                URL
              </button>
              <button
                className={`type-btn ${sourceTypes[signal] === 'file' ? 'active' : ''}`}
                onClick={() => handleSourceTypeChange(signal, 'file')}
              >
                Local File
              </button>
            </div>
            {sourceTypes[signal] === 'url' ? (
              <input
                type="text"
                value={source}
                onChange={(e) => handleInputChange(signal, e.target.value)}
                placeholder="Enter video source URL or device ID"
              />
            ) : (
              <div className="file-input-container">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileSelect(signal, e)}
                  className="file-input"
                />
                {source && (
                  <div className="selected-file">
                    Selected: {source.split('/').pop()}
                  </div>
                )}
              </div>
            )}
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