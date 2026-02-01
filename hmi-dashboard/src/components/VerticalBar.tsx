import React from 'react';
import './VerticalBar.css';

interface VerticalBarProps {
    label: string;
    value: number; // Current value
    min: number;
    max: number;
    unit?: string;
    lowWarning?: number; // Threshold for low warning (fuel)
    highWarning?: number; // Threshold for high warning (temp)
}

const VerticalBar: React.FC<VerticalBarProps> = ({
    label,
    value,
    min,
    max,
    unit = '',
    lowWarning,
    highWarning
}) => {
    // Calculate percentage
    const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

    // Determine color based on thresholds
    let barColor = 'var(--color-status)'; // Default Green
    let isWarning = false;

    if (lowWarning !== undefined && value <= lowWarning) {
        barColor = 'var(--color-alert)'; // Red for low fuel
        isWarning = true;
    } else if (highWarning !== undefined && value >= highWarning) {
        barColor = 'var(--color-alert)'; // Red for high temp
        isWarning = true;
    }

    // Generate segments (e.g., 20 blocks)
    const segments = 20;
    const activeSegments = Math.round((percentage / 100) * segments);

    return (
        <div className="vertical-bar-container">
            <div className="bar-header">{label}</div>

            <div className="bar-graph">
                {Array.from({ length: segments }).map((_, index) => {
                    // Render from bottom up, so invert index for display logic if needed or use flex-direction: column-reverse
                    // With flex-direction: column-reverse, index 0 is bottom.
                    const isActive = index < activeSegments;

                    return (
                        <div
                            key={index}
                            className={`bar-segment ${isActive ? 'active' : 'inactive'}`}
                            style={{ backgroundColor: isActive ? barColor : 'var(--color-inactive)' }}
                        />
                    );
                })}
            </div>

            <div className={`bar-value ${isWarning ? 'warning' : ''}`}>
                {value}{unit}
            </div>
        </div>
    );
};

export default VerticalBar;
