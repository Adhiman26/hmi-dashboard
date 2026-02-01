import React from 'react';
import './StatusCluster.css';

const StatusCluster: React.FC = () => {
    return (
        <div className="status-cluster-container">
            <div className="status-block">
                <div className="status-label">HMR</div>
                <div className="status-value">1245.8</div>
            </div>

            <div className="divider" />

            <div className="status-block">
                <div className="status-label">GEAR</div>
                <div className="status-value highlight">N</div>
            </div>

            <div className="status-block">
                <div className="status-label">SPEED</div>
                <div className="status-value">0 <span className="unit">km/h</span></div>
            </div>
        </div>
    );
};

export default StatusCluster;
