import React, { useEffect, useState, useRef } from 'react';

import PropTypes from 'prop-types';
import './ProgressBar.css';

const ProgressBar = (props) => {
  const [offset, setOffset] = useState(0);
  const [color, setColor] = useState(1);
  const [stroke, setStroke] = useState(2);
  const circleRef = useRef(null);
  const { size, malicious, scans, strokeWidth, circleTwoStroke } = props;

  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((scans - malicious) / scans) * circumference;
    setOffset(progressOffset);
    circleRef.current.style =
      'transition: stroke-dashoffset 850ms ease-in-out;';
  }, [setOffset, scans, circumference, malicious, color, offset]);

  useEffect(() => {
    if (malicious > 0) {
      const color = 'red';
      setColor(color);
    } else {
      const color = '#3cb371';
      setColor(color);
    }
  }, [setColor, malicious, color]);

  useEffect(() => {
    if (malicious > 0) {
      const stroke = '#D0D0D0';
      setStroke(stroke);
    } else {
      const stroke = '#3cb371';
      setStroke(stroke);
    }
  }, [setStroke, malicious, stroke]);

  return (
    <>
      <svg className="svg d-none d-md-block" width={size} height={size}>
        <circle
          className="svg-circle-bg"
          stroke={stroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="svg-circle"
          ref={circleRef}
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x={`${center}`}
          y={`${center}`}
          className="svg-circle-text big-text"
          fill={color}
        >
          {malicious}
        </text>
        <text
          x={`${center}`}
          y={`${center + 20}`}
          className="svg-circle-text white-fill"
        >
          /{scans}
        </text>
      </svg>
    </>
  );
};

ProgressBar.propTypes = {
  size: PropTypes.number.isRequired,
  malicious: PropTypes.number.isRequired,
  scans: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  circleTwoStroke: PropTypes.string.isRequired,
};

export default ProgressBar;