import React, { useState, useEffect } from 'react';
import AreaSelectorVideo from "./dashboard/AreaSelectorVideo";
import VideoSourceConfig from "./dashboard/VideoSourceConfig";
import AnalyticsDashboard from "./dashboard/AnalyticsDashboard";
import Settings from "./dashboard/Settings";

const DashboardPage = ({ navigate, junction }) => {
  const [systemData, setSystemData] = useState({
    totalVehicles: 0,
    systemEfficiency: 0,
    cycleTime: 0,
    activeSignal: 'A'
  });

  const [signals, setSignals] = useState([
    { id: 'A', status: 'red', time: 0, vehicles: 0, weight: 0, efficiency: 0 },
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
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

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

  const handleStartSystem = () => {
    // Check if areas are defined
    if (!areaPointsList.length || areaPointsList.length !== 4) {
      alert("⚠️ Please define detection areas first!");
      setLogs(prev => [...prev, '[WARNING] Cannot start system: Detection areas not defined']);
      return;
    }

    // Check if all video sources are configured
    const allVideosConfigured = Object.values(videoSources).every(source => source.trim() !== '');
    if (!allVideosConfigured) {
      alert("⚠️ Please configure all video sources before starting the system!");
      setLogs(prev => [...prev, '[WARNING] Cannot start system: Video sources not configured']);
      return;
    }

    // Start the system
    setIsSystemRunning(true);
    setLogs(prev => [...prev, '🚀 Traffic management system started']);
    setLogs(prev => [...prev, `[INFO] Using areas: ${JSON.stringify(areaPointsList)}`]);

    // Set all signals to RED initially
    setSignals(prev => prev.map(signal => ({
      ...signal,
      status: 'red',
      time: 0
    })));

    // Log area setup for each signal
    areaPointsList.forEach((area, index) => {
      setLogs(prev => [...prev, `[INFO] Setting up Signal ${String.fromCharCode(65 + index)} with area: ${JSON.stringify(area)}`]);
    });

    // Start video processing for each signal
    Object.entries(videoSources).forEach(([signal, source]) => {
      setLogs(prev => [...prev, `[INFO] Starting video processing for Signal ${signal}`]);
      // Here you would typically start your video processing threads
      // For now, we'll just log it
      setLogs(prev => [...prev, `✅ Video thread started for Signal ${signal}`]);
    });

    // Set initial signal to GREEN
    setSignals(prev => prev.map((signal, index) => ({
      ...signal,
      status: index === 0 ? 'green' : 'red'
    })));

    setSystemData(prev => ({
      ...prev,
      activeSignal: 'A'
    }));

    setLogs(prev => [...prev, '[INFO] System initialization complete']);
    alert("Traffic management system is now running!");
  };

  const handleSettingsSave = (newSettings) => {
    // Update signals with new settings
    setSignals(prev => prev.map(signal => ({
      ...signal,
      min_green_time: newSettings[signal.id].minGreenTime,
      max_green_time: newSettings[signal.id].maxGreenTime
    })));

    // Log the settings update
    setLogs(prev => [...prev, '[INFO] Signal timing settings updated']);
  };

  const handleEmergencyMode = () => {
    const newEmergencyMode = !emergencyMode;
    setEmergencyMode(newEmergencyMode);
    
    // Log the emergency mode status change
    setLogs(prev => [...prev, `[INFO] Emergency mode ${newEmergencyMode ? 'ACTIVATED' : 'DEACTIVATED'}`]);
    
    // Show notification
    if (newEmergencyMode) {
      alert("Emergency mode activated!\nAll signals will prioritize emergency vehicles.");
    }
  };

  const handleStopSystem = () => {
    if (!isSystemRunning) {
      alert("The system is already stopped.");
      return;
    }

    // Log the stop action
    setLogs(prev => [...prev, "🛑 Stopping traffic management system..."]);

    // Stop the system
    setIsSystemRunning(false);

    // Reset all signals
    setSignals(prev => prev.map(signal => ({
      ...signal,
      current_state: 'RED',
      remaining_time: 0,
      vehicle_count: 0,
      traffic_weight: 0
    })));

    // Clear video displays
    setVideoSources(prev => {
      const newSources = { ...prev };
      Object.keys(newSources).forEach(key => {
        newSources[key] = null;
      });
      return newSources;
    });

    // Log completion
    setLogs(prev => [...prev, "System stopped and reset."]);

    // Show notification
    alert("Traffic management system has been stopped.");
  };

  const validateAreaShape = (area, index) => {
    // Basic validation - ensure area has 4 points forming a quadrilateral
    if (area.length !== 4) return false;
    
    // Check if points are in clockwise or counterclockwise order
    let sum = 0;
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      sum += (area[j][0] - area[i][0]) * (area[j][1] + area[i][1]);
    }
    
    // Area should be non-zero
    return Math.abs(sum) > 0;
  };

  const handleLoadAreas = async () => {
    try {
      // Check if areas file exists
      const response = await fetch('/api/areas');
      if (!response.ok) {
        setLogs(prev => [...prev, "⚠️ Areas file not found!"]);
        alert("Areas file not found. Please define new areas first.");
        return;
      }

      const loadedAreas = await response.json();

      // Validate loaded areas
      if (!Array.isArray(loadedAreas) || loadedAreas.length !== 4) {
        setLogs(prev => [...prev, "⚠️ Invalid areas format - expected list of 4 areas"]);
        alert("Invalid areas format in file. Please define new areas.");
        return;
      }

      // Validate each area
      for (let i = 0; i < loadedAreas.length; i++) {
        const area = loadedAreas[i];
        
        if (!Array.isArray(area) || area.length !== 4) {
          setLogs(prev => [...prev, `⚠️ Invalid format for area ${i} - expected list of 4 points`]);
          alert(`Invalid format for Signal ${String.fromCharCode(65 + i)} area. Please define new areas.`);
          return;
        }

        for (const point of area) {
          if (!Array.isArray(point) || point.length !== 2) {
            setLogs(prev => [...prev, `⚠️ Invalid point format in area ${i} - expected [x, y]`]);
            alert(`Invalid point format in Signal ${String.fromCharCode(65 + i)}. Please define new areas.`);
            return;
          }

          const [x, y] = point;
          if (typeof x !== 'number' || typeof y !== 'number') {
            setLogs(prev => [...prev, `⚠️ Invalid coordinates in area ${i} - expected numbers`]);
            alert(`Invalid coordinates in Signal ${String.fromCharCode(65 + i)}. Please define new areas.`);
            return;
          }
        }

        // Convert to integer coordinates
        loadedAreas[i] = area.map(([x, y]) => [Math.round(x), Math.round(y)]);

        // Validate the area shape
        if (!validateAreaShape(loadedAreas[i], i)) {
          setLogs(prev => [...prev, `⚠️ Invalid area shape for Signal ${String.fromCharCode(65 + i)}`]);
          alert(`Invalid area shape for Signal ${String.fromCharCode(65 + i)}. Please define new areas.`);
          return;
        }
      }

      // Stop any running system before updating areas
      if (isSystemRunning) {
        handleStopSystem();
      }

      // Update areas
      setAreaPointsList(loadedAreas);
      setLogs(prev => [...prev, "✅ Areas loaded successfully"]);
      setLogs(prev => [...prev, `Loaded areas: ${JSON.stringify(loadedAreas)}`]);
      alert("Areas loaded successfully!");

    } catch (error) {
      setLogs(prev => [...prev, `⚠️ Error loading areas: ${error.message}`]);
      alert(`Failed to load areas: ${error.message}`);
    }
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

            <button 
              className="control-btn green"
              onClick={handleLoadAreas}
            >📁 Load Areas
            </button>
            <button 
              className="control-btn dark-green"
              onClick={handleStartSystem}
              disabled={isSystemRunning}
            >▶️ Start System
            </button>
            <button 
              className="control-btn red"
              onClick={handleStopSystem}
            >⏹️ Stop System
            </button>
            <button 
              className={`control-btn ${emergencyMode ? 'dark-green' : 'orange'}`}
              onClick={handleEmergencyMode}
            >🚨 {emergencyMode ? 'Emergency Mode Active' : 'Emergency Mode'}
            </button>
            <button 
              className="control-btn purple"
              onClick={() => setShowAnalytics(true)}
            >📊 Analytics
            </button>
            <button 
              className="control-btn gray"
              onClick={() => setShowSettings(true)}
            >⚙️ Settings
            </button>
          </div>
        </div>

        {showVideoConfig && (
          <div className="modal-overlay">
            <VideoSourceConfig
              onSave={handleVideoConfigSave}
              onCancel={() => setShowVideoConfig(false)}
              initialSources={videoSources}
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

        {showAnalytics && (
          <AnalyticsDashboard
            onClose={() => setShowAnalytics(false)}
            signals={signals}
            systemData={systemData}
          />
        )}

        {showSettings && (
          <Settings
            onClose={() => setShowSettings(false)}
            signals={signals}
            onSave={handleSettingsSave}
          />
        )}
      </main>
    </>
  );
};

export default DashboardPage; 