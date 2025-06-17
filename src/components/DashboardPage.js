import React, { useState, useEffect } from 'react';
import AreaSelectorVideo from "./dashboard/AreaSelectorVideo";
import VideoSourceConfig from "./dashboard/VideoSourceConfig";

const DashboardPage = ({ navigate, junction }) => {
  const [systemData, setSystemData] = useState({
    totalVehicles: 0,
    systemEfficiency: 0,
    cycleTime: 0,
    activeSignal: 'A'
  });

  const [signals, setSignals] = useState([
    { id: 'A', status: 'green', time: 0, vehicles: 0, weight: 0, efficiency: 0 },
    { id: 'B', status: 'red', time: 0, vehicles: 0, weight: 0, efficiency: 0 },
    { id: 'C', status: 'red', time: 0, vehicles: 0, weight: 0, efficiency: 0 },
    { id: 'D', status: 'red', time: 0, vehicles: 0, weight: 0, efficiency: 0 }
  ]);

  const [logs, setLogs] = useState([
    '[INFO] System initialized successfully',
    '[INFO] Camera feeds connected',
    '[INFO] YOLOv8 model loaded successfully'
  ]);

  const [showAreaSelector, setShowAreaSelector] = useState(false);
  const [showVideoConfig, setShowVideoConfig] = useState(false);
  const [currentSignalIdx, setCurrentSignalIdx] = useState(0);
  const [areaPointsList, setAreaPointsList] = useState([]);
  const [videoSources, setVideoSources] = useState({
    A: '',
    B: '',
    C: '',
    D: ''
  });

  const handleVideoConfigSave = (config) => {
    setVideoSources(config);
    setShowVideoConfig(false);
    setLogs(prev => [...prev, '[INFO] Video sources configured successfully']);
  };

  const handleStartAreaSelection = () => {
    const values = Object.values(videoSources);
    const allFilled = values.every(path => path.trim() !== "");
    if (!allFilled) {
      alert("⚠️ Please configure all 4 video sources before drawing areas.");
      return;
    }

    setAreaPointsList([]);
    setCurrentSignalIdx(0);
    setShowAreaSelector(true);
    setLogs(prev => [...prev, '[INFO] Starting area selection process']);
  };

  const handleAreaSave = (points) => {
    const updated = [...areaPointsList];
    updated[currentSignalIdx] = points;
    setAreaPointsList(updated);
    setLogs(prev => [...prev, `[INFO] Area saved for Signal ${["A", "B", "C", "D"][currentSignalIdx]}`]);

    if (currentSignalIdx < 3) {
      setCurrentSignalIdx(currentSignalIdx + 1);
    } else {
      setShowAreaSelector(false);
      setLogs(prev => [...prev, '[INFO] All areas collected successfully']);
      // Send to backend if needed
      fetch('/api/save-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videos: videoSources,
          areas: updated
        })
      }).then(response => {
        if (response.ok) {
          setLogs(prev => [...prev, '[INFO] Areas saved to backend successfully']);
        } else {
          setLogs(prev => [...prev, '[ERROR] Failed to save areas to backend']);
        }
      }).catch(error => {
        setLogs(prev => [...prev, `[ERROR] ${error.message}`]);
      });
    }
  };

  const handleAreaSelectionCancel = () => {
    setShowAreaSelector(false);
    setAreaPointsList([]);
    setCurrentSignalIdx(0);
    setLogs(prev => [...prev, '[INFO] Area selection cancelled']);
  };

  return (
    <>
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <h1>{junction ? `${junction} - Traffic Management Dashboard` : 'Traffic Management Dashboard'}</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setShowVideoConfig(true)} className="main-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              📹 Configure Video Sources
            </button>
            <button onClick={() => navigate('select-junction')} className="main-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              🔄 Switch Junction
            </button>
          </div>
        </div>
      </div>

      <main className="dashboard-main">
        <div className="video-grid">
          {signals.map((signal) => (
            <div key={signal.id} className="signal-card">
              <div className="signal-title">Signal {signal.id}</div>
              <div className="video-feed">
                {videoSources[signal.id] ? (
                  <video
                    src={videoSources[signal.id]}
                    controls
                    autoPlay
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  'No video source configured'
                )}
              </div>
              <div className="signal-info">
                <div className={`status-label ${signal.status}`}>
                  {signal.status === 'green' ? '🟢' : signal.status === 'yellow' ? '🟡' : '🔴'} {signal.status.toUpperCase()}
                </div>
                <div className="time-label">Time: {signal.time}s</div>
                <div className="count-label">Vehicles: {signal.vehicles} | Weight: {signal.weight.toFixed(1)}</div>
                <div className="efficiency-label">Efficiency: {signal.efficiency.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-side">
          <div className="system-status">
            <div>Total Vehicles: <span>{systemData.totalVehicles}</span></div>
            <div>System Efficiency: <span>{systemData.systemEfficiency.toFixed(1)}%</span></div>
            <div>Cycle Time: <span>{systemData.cycleTime}s</span></div>
            <div>Active Signal: <span>{systemData.activeSignal}</span></div>
          </div>

          <div className="system-log">
            <div className="log-title">System Log</div>
            <textarea className="log-text" readOnly value={logs.join('\n')} />
          </div>

          <div className="dashboard-controls">
            <button
              className="control-btn blue"
              onClick={handleStartAreaSelection}
            >🎯 New Areas
            </button>

            <button className="control-btn green">📁 Load Areas</button>
            <button className="control-btn dark-green">▶️ Start System</button>
            <button className="control-btn red">⏹️ Stop System</button>
            <button className="control-btn orange">🚨 Emergency Mode</button>
            <button className="control-btn purple">📊 Analytics</button>
            <button className="control-btn gray">⚙️ Settings</button>
          </div>
        </div>

        {showVideoConfig && (
          <div className="modal-overlay">
            <VideoSourceConfig
              onSave={handleVideoConfigSave}
              onCancel={() => setShowVideoConfig(false)}
            />
          </div>
        )}

        {showAreaSelector && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Define Area for Signal {["A", "B", "C", "D"][currentSignalIdx]}
              </h3>
              <AreaSelectorVideo
                videoSrc={videoSources[["A", "B", "C", "D"][currentSignalIdx]]}
                onSave={handleAreaSave}
                onCancel={handleAreaSelectionCancel}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default DashboardPage; 