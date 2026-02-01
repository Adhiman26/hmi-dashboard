import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import RPMGauge from './components/RPMGauge';
import VerticalBar from './components/VerticalBar';
import StatusCluster from './components/StatusCluster';
import AlertRibbon from './components/AlertRibbon';
import type { Alert } from './components/AlertRibbon';

function App() {
  // Simulation State
  const [rpm, setRpm] = useState(0);
  const [coolantTemp, setCoolantTemp] = useState(85);
  const [fuelLevel, setFuelLevel] = useState(75);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const startTimeRef = useRef(Date.now());

  // Simulate dynamic data
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate RPM slightly around 1200 or 2500 for demo
      const baseRpm = 1250;
      const fluctuation = Math.random() * 50 - 25;
      setRpm(prev => {
        const newValue = prev + (baseRpm - prev) * 0.1 + fluctuation;
        return Math.max(0, Math.min(newValue, 3500));
      });

      // Slowly change temp and fuel
      setCoolantTemp(prev => Math.min(120, Math.max(40, prev + (Math.random() - 0.5))));
      setFuelLevel(prev => Math.min(100, Math.max(0, prev - 0.01))); // Slowly burn fuel

      // Simulation for specific alerts requested by user
      // "BRAKE FAILURE", "STOP ENGINE", "CHECK ENGINE", "LOW FUEL", "AIR FILTER CLOG", "BATTERY CHARGE"
      // Wait 5 seconds before showing any alerts (Dark Cockpit initially)
      if (Date.now() - startTimeRef.current > 5000 && Math.random() > 0.95) {
        setAlerts(prev => {
          const possibleAlerts: Alert[] = [
            { id: 'brake', label: "BRAKE FAILURE", severity: 'critical' },
            { id: 'stop', label: "STOP ENGINE", severity: 'critical' },
            { id: 'engine', label: "CHECK ENGINE", severity: 'warning' },
            { id: 'fuel', label: "LOW FUEL", severity: 'warning' },
            { id: 'air', label: "AIR FILTER CLOG", severity: 'warning' },
            { id: 'battery', label: "BATTERY CHARGE", severity: 'warning' }
          ];

          // Randomly pick one to add or remove
          const targetIndex = Math.floor(Math.random() * possibleAlerts.length);
          const target = possibleAlerts[targetIndex];
          const exists = prev.find(a => a.id === target.id);

          if (exists) {
            // 50% chance to remove if exists
            return Math.random() > 0.5 ? prev.filter(a => a.id !== target.id) : prev;
          } else {
            // Add if not exists, up to 6 max to show rows filling
            if (prev.length < 6) {
              return [...prev, target];
            }
            return prev;
          }
        });
      }
    }, 500); // Faster update rate for demo visibility

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header className="dashboard-header">
        <Header />
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Left Pillar: Coolant */}
        <div className="pillar-left">
          <VerticalBar
            label="COOLANT TEMP"
            value={Math.round(coolantTemp)}
            min={40}
            max={120}
            unit="°C"
            highWarning={110}
          />
        </div>

        {/* Center: RPM Gauge + Secondary Data */}
        <div className="center-gauge-area">
          <RPMGauge value={rpm} />
          <div className="secondary-data">
            <div className="sec-data-block">
              <span className="sec-label">ADBLUE</span>
              <span className="sec-value">85%</span>
            </div>
            <div className="sec-data-block">
              <span className="sec-label">HYDRAULIC PRESS</span>
              <span className="sec-value">180 <small>BAR</small></span>
            </div>
          </div>
        </div>

        {/* Right Pillar: Fuel */}
        <div className="pillar-right">
          <VerticalBar
            label="FUEL LEVEL"
            value={Math.round(fuelLevel)}
            min={0}
            max={100}
            unit="%"
            lowWarning={15}
          />
        </div>
      </main>

      {/* Lower Center Status Cluster */}
      <section className="dashboard-status">
        <StatusCluster />
      </section>

      {/* Bottom Alert Ribbon */}
      <footer className="dashboard-footer">
        <AlertRibbon alerts={alerts} />
      </footer>
    </div>
  );
}

export default App;
