import React, { useState, useRef, useEffect } from 'react';

const CurvedSliderD1 = ({ 
  value = 0, 
//   onChange,
  width = 300,
  height = 180,
  sliderType = 'curved',
  position = { x: 0, y: 0 },
  strokeWidth = 15,
  thumbRadius = 10,
  thumbStrokeWidth = 3,
  activeColor = '#4a90e2',
  inactiveColor = '#e0e0e0',
  min = -100,
  max = 100
}) => {
  const sliderRef = useRef(null);
  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);
  const [leftTrackLength, setLeftTrackLength] = useState(0);
  const [rightTrackLength, setRightTrackLength] = useState(0);

  const getPathData = () => {
    const centerX = width / 2;
    const centerY = (height / 2);
    
    switch (sliderType) {
      case 'horizontal':
        return {
          fullPath: `M ${30} ${centerY} L ${width - 30} ${centerY}`,
          leftPath: `M ${centerX} ${centerY} L ${30} ${centerY}`,
          rightPath: `M ${centerX} ${centerY} L ${width - 30} ${centerY}`,
          centerPoint: { x: centerX, y: centerY }
        };
        
      case 'vertical':
        return {
          fullPath: `M ${centerX} ${30} L ${centerX} ${height - 30}`,
          leftPath: `M ${centerX} ${centerY} L ${centerX} ${height - 30}`,
          rightPath: `M ${centerX} ${centerY} L ${centerX} ${30}`,
          centerPoint: { x: centerX, y: centerY }
        };
        
      default: // curved
        return {
          fullPath: `M 30 ${height - 30} Q ${width/3} ${30}, ${centerX} ${centerY-40} Q ${2*width/3} ${30}, ${width - 30} ${height - 30}`,
          leftPath: `M ${centerX} ${centerY-40} Q ${width/3} ${30}, 30 ${height - 30}`,
          rightPath: `M ${centerX} ${centerY-40} Q ${2*width/3} ${30}, ${width - 30} ${height - 30}`,
          centerPoint: { x: centerX, y: centerY-40 }
        };
    }
  };

  const paths = getPathData();
  
  useEffect(() => {
    if (leftTrackRef.current && rightTrackRef.current) {
      setLeftTrackLength(leftTrackRef.current.getTotalLength());
      setRightTrackLength(rightTrackRef.current.getTotalLength());
    }
  }, [sliderType, width, height]);
  
  const calculateThumbPosition = () => {
    let trackRef, trackLength;
    
    if (value < 0) {
      trackRef = leftTrackRef.current;
      trackLength = leftTrackLength;
    } else {
      trackRef = rightTrackRef.current;
      trackLength = rightTrackLength;
    }
    
    if (!trackRef || trackLength === 0) return paths.centerPoint;
    
    const progress = Math.abs(value) / (max - min);
    const position = progress * trackLength;
    
    return trackRef.getPointAtLength(position);
  };
  
  const calculateDashArray = (isLeft) => {
    const trackLength = isLeft ? leftTrackLength : rightTrackLength;
    if (trackLength === 0) return "0, 0";
    
    const progress = Math.abs(value) / (max - min);
    const activeLength = progress * trackLength;
    
    if (isLeft) {
      return value < 0 ? `${activeLength} ${trackLength}` : `0 ${trackLength}`;
    } else {
      return value > 0 ? `${activeLength} ${trackLength}` : `0 ${trackLength}`;
    }
  };

  const thumbPosition = calculateThumbPosition();

  return (
    <div className="slider-wrapper" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
      {/* <div className="slider-wrapper"> */}
        <svg 
          width={width} 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          className="slider-svg"
        >
          {/* Full background track */}
          <path
            d={paths.fullPath}
            fill="none"
            stroke={inactiveColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Left active track */}
          <path
            ref={leftTrackRef}
            d={paths.leftPath}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={calculateDashArray(true)}
          />
          
          {/* Right active track */}
          <path
            ref={rightTrackRef}
            d={paths.rightPath}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={calculateDashArray(false)}
          />
          
          {/* Center marker */}
          <circle
            cx={paths.centerPoint.x}
            cy={paths.centerPoint.y}
            r="1"
            fill={activeColor}
          />
          
          {/* Thumb */}
          <circle
            cx={thumbPosition.x}
            cy={thumbPosition.y}
            r={thumbRadius}
            fill="#ffffff"
            stroke={activeColor}
            strokeWidth={thumbStrokeWidth}
            className="slider-thumb"
          />
        </svg>
      {/* </div> */}
    </div>
  );
};

// Example usage component
const SliderDemo1 = () => {
  const [curvedValue, setCurvedValue] = useState(0);
  const [verticalValue, setVerticalValue] = useState(0);
  const [horizontalValue, setHorizontalValue] = useState(0);

  return (
    <div className="app-container">
      <h1>Slider Variations</h1>
      
      <div className="demo-container">
        {/* Curved Slider */}
        <CurvedSliderD1 
          sliderType="curved"
          width={300}
          height={150}
          position={{ x: 0, y: 0 }}
          strokeWidth={8}
          activeColor="#4a90e2"
          value={curvedValue}
          onChange={setCurvedValue}
        />

        {/* Vertical Slider */}
        <CurvedSliderD1 
          sliderType="vertical"
          width={100}
          height={200}
          position={{ x: 350, y: 0 }}
          strokeWidth={8}
          activeColor="#4a90e2"
          value={verticalValue}
          onChange={setVerticalValue}
        />

        {/* Horizontal Slider */}
        <CurvedSliderD1 
          sliderType="horizontal"
          width={300}
          height={100}
          position={{ x: 500, y: 100 }}
          strokeWidth={8}
          activeColor="#4a90e2"
          value={horizontalValue}
          onChange={setHorizontalValue}
        />
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .app-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .demo-container {
    position: relative;
    min-height: 400px;
  }
  
  .slider-container {
    position: absolute;
    // background: #ffffff;
    // background: none;
    border-radius: 12px;
  }
  
  .slider-wrapper {
    position: relative;
    margin: auto;
    width: 100%;
    height: 50%;
    // background: #ffffff;
  }
  
  .slider-svg {
    height: 100%;
    width: 100%;
    margin: auto;
    // display: block;
  }
  
  .slider-thumb {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    transition: transform 0.1s ease;
  }
`;

// Add styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CurvedSliderD1;