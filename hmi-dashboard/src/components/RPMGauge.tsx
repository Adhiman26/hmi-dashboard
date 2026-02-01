import React from 'react';
import './RPMGauge.css';

interface RPMGaugeProps {
    value: number; // Current RPM (0 - 3500)
}

const RPMGauge: React.FC<RPMGaugeProps> = ({ value }) => {
    const MAX_RPM = 3500;


    // SVG Configuration
    const size = 450; // Scaled down for 1024px height
    const center = size / 2;
    const radius = 210; // Adjusted for new size
    const strokeWidth = 16; // Thinner stroke
    const startAngle = -220; // Start at bottom-left
    const endAngle = 40;     // End at bottom-right

    // Calculate polar coordinates
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    // Dynamic values for arc drawing
    const totalAngle = endAngle - startAngle;
    const valueAngle = startAngle + (Math.min(value, MAX_RPM) / MAX_RPM) * totalAngle;
    // const redlineStartAngle = startAngle + (REDLINE_RPM / MAX_RPM) * totalAngle;

    return (
        <div className="rpm-gauge-container">
            <svg width={size} height={size} className="rpm-svg">
                <defs>
                    <pattern id="redline-pattern" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line stroke="#FF1744" strokeWidth="6" x1="0" y1="0" x2="0" y2="10" />
                    </pattern>
                    <linearGradient id="needle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00E676" />
                        <stop offset="100%" stopColor="#00BFA5" />
                    </linearGradient>
                </defs>

                {/* Background Arc (Gray Track) */}
                <path
                    d={describeArc(center, center, radius, startAngle, endAngle)}
                    fill="none"
                    stroke="var(--color-inactive)"
                    strokeWidth={strokeWidth}
                    opacity="0.2"
                />

                {/* Active Arc (Green/Dynamic) */}
                <path
                    d={describeArc(center, center, radius, startAngle, valueAngle)}
                    fill="none"
                    stroke="url(#needle-gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="active-arc"
                />

                {/* Redline Zone Marker (Static textured segment from 2800 to 3500) */}
                {/* We draw a separate arc for the redline zone behind or on top */}
                {/* Note: In a real implementation, we might meticulously mask this, but here we overlay a textured stroke */}
                {/* Simplified: Red stroke for redline */}
                {/* <path
          d={describeArc(center, center, radius, redlineStartAngle, endAngle)}
          fill="none"
          stroke="url(#redline-pattern)" // Applying pattern texture
          strokeWidth={strokeWidth + 4} // Slightly wider to be visible
          opacity="0.8"
         /> */}

                {/* Ticks and Labels */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const tickValue = i * 500;
                    const angle = startAngle + (tickValue / MAX_RPM) * totalAngle;
                    // Ticks close to the arc
                    const tickPos = polarToCartesian(center, center, radius - 20, angle);
                    // Labels pushed out 
                    const labelPos = polarToCartesian(center, center, radius - 45, angle);

                    return (
                        <g key={i}>
                            <line
                                x1={polarToCartesian(center, center, radius, angle).x}
                                y1={polarToCartesian(center, center, radius, angle).y}
                                x2={tickPos.x}
                                y2={tickPos.y}
                                stroke="var(--color-data)"
                                strokeWidth={i % 2 === 0 ? 3 : 1}
                            />
                            <text
                                x={labelPos.x}
                                y={labelPos.y}
                                fill="var(--color-data)"
                                fontSize="24"
                                fontWeight="bold"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {tickValue}
                            </text>
                        </g>
                    );
                })}

                {/* Redline Label */}
                <text
                    x={polarToCartesian(center, center, radius + 40, endAngle).x - 20}
                    y={polarToCartesian(center, center, radius + 40, endAngle).y + 20}
                    fill="var(--color-alert)"
                    fontSize="18"
                    fontWeight="bold"
                >
                    REDLINE
                </text>
            </svg>

            {/* Digital Hub Center */}
            <div className="digital-hub">
                <div className="rpm-value">{Math.round(value)}</div>
                <div className="rpm-label">RPM</div>
            </div>
        </div>
    );
};

export default RPMGauge;
