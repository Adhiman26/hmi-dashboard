import React from 'react';
import './AlertRibbon.css';

export interface Alert {
    id: string;
    label: string;
    severity: 'critical' | 'warning';
}

interface AlertRibbonProps {
    alerts?: Alert[];
}

// Fixed grid slots to ensure consistent layout
const MAX_SLOTS = 12; // 2x6 grid

const AlertRibbon: React.FC<AlertRibbonProps> = ({ alerts = [] }) => {
    // ISO 7000 terms as per requirements
    // "BRAKE FAILURE", "STOP ENGINE", "CHECK ENGINE", "LOW FUEL", "AIR FILTER CLOG", "BATTERY CHARGE"

    // Fill the rest of the grid with empty slots to maintain layout
    const gridSlots = Array.from({ length: MAX_SLOTS });

    return (
        <div className="alert-ribbon-container">
            {gridSlots.map((_, index) => {
                const alert = alerts[index];
                if (!alert) {
                    return <div key={index} className="alert-slot empty" />;
                }

                return (
                    <div
                        key={alert.id}
                        className={`alert-slot ${alert.severity}`}
                    >
                        <span className="alert-text">{alert.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertRibbon;
