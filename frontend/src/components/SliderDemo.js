import React, { useState, useRef, useEffect } from 'react';

const CurvedSliderD = ({ value = 0, curvePath, leftPath, rightPath }) => {
  const sliderRef = useRef(null);
  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);
  const [leftTrackLength, setLeftTrackLength] = useState(0);
  const [rightTrackLength, setRightTrackLength] = useState(0);
  
  // Define the curve path data
  const centerPoint = { x: 150, y: 50 };
//   const curvePath = `M 30 150 Q 70 50, ${centerPoint.x} ${centerPoint.y} Q 230 50, 270 150`;
//   const curvePath = `M 0 50 Q 70 50, ${centerPoint.x} ${centerPoint.y} Q 230 50, 300 50`;
  
  // Left half path (from center to left)
//   const leftPath = `M ${centerPoint.x} ${centerPoint.y} Q 70 50, 30 150`;

  // Right half path (from center to right)
//   const rightPath = `M ${centerPoint.x} ${centerPoint.y} Q 230 50, 270 150`;
  
  // Initialize path lengths
  useEffect(() => {
    if (leftTrackRef.current && rightTrackRef.current) {
      setLeftTrackLength(leftTrackRef.current.getTotalLength());
      setRightTrackLength(rightTrackRef.current.getTotalLength());
    }
  }, []);
  
  // Calculate thumb position
  const calculateThumbPosition = () => {
    let trackRef, trackLength;
    
    if (value < 0) {
      trackRef = leftTrackRef.current;
      trackLength = leftTrackLength;
    } else {
      trackRef = rightTrackRef.current;
      trackLength = rightTrackLength;
    }
    
    if (!trackRef || trackLength === 0) return centerPoint;
    
    const progress = Math.abs(value) / 100;
    const position = progress * trackLength;
    
    return trackRef.getPointAtLength(position);
  };
  
  const thumbPosition = calculateThumbPosition();
  
  // Calculate track dasharray
  const calculateDashArray = (isLeft) => {
    const trackLength = isLeft ? leftTrackLength : rightTrackLength;
    if (trackLength === 0) return "0, 0";
    
    const progress = Math.abs(value) / 100;
    const activeLength = progress * trackLength;
    
    if (isLeft) {
      return value < 0 ? `${activeLength} ${trackLength}` : `0 ${trackLength}`;
    } else {
      return value > 0 ? `${activeLength} ${trackLength}` : `0 ${trackLength}`;
    }
  };

  return (
    // <div>
    // <div className="slider-container">
      
    <div className="slider-wrapper" >
        <svg 
            width="300" 
            height="180" 
            viewBox="0 20 300 270"
            className="slider-svg"
        >
            {/* Full background track */}
            <path
            d={curvePath}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="10"
            strokeLinecap="round"
            />
            
            {/* Left active track */}
            <path
            ref={leftTrackRef}
            d={leftPath}
            fill="none"
            stroke="#4a90e2"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={calculateDashArray(true)}
            />
            
            {/* Right active track */}
            <path
            ref={rightTrackRef}
            d={rightPath}
            fill="none"
            stroke="#4a90e2"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={calculateDashArray(false)}
            />
            
            {/* Center marker */}
            <circle
            cx={centerPoint.x}
            cy={centerPoint.y}
            r="4"
            fill="#4a90e2"
            />
            
            {/* Thumb */}
            <circle
            cx={thumbPosition.x}
            cy={thumbPosition.y}
            r="10"
            fill="#ffffff"
            stroke="#4a90e2"
            strokeWidth="3"
            className="slider-thumb"
            />
        </svg>
    </div>
    // </div>
  );
};

// Example usage
const SliderDemo = () => {
  const [sliderValue, setSliderValue] = useState(0);
  
  return (
    <div className="app-container">
      <h1>Interactive Curved Slider</h1>
      <p>Slider fills from center based on value</p>
      
      <div className="demo-container">
        <CurvedSliderD 
          value={sliderValue} 
          onChange={setSliderValue} 
        />
        
        <div className="explanation">
          <h3>How It Works:</h3>
          <ul>
            <li>The slider track is curved with a concave downward shape</li>
            <li>Center point (0) is marked with a blue dot</li>
            <li>Track fills from center to thumb position</li>
            <li>Negative values fill to the left of center</li>
            <li>Positive values fill to the right of center</li>
            <li>Thumb follows the exact curve path</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .app-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  }
  
  h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  p {
    text-align: center;
    color: #7f8c8d;
    margin-bottom: 30px;
  }
  
  .demo-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    background: white;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  }
  
  .slider-container {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .slider-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .slider-header h2 {
    color: #2c3e50;
    margin: 0;
    font-size: 1.4rem;
  }
  
  .slider-header p {
    color: #7f8c8d;
    margin: 5px 0 0;
    font-size: 0.95rem;
  }
  
  .slider-wrapper {
    position: relative;
    margin: 0 auto;
    width: 300px;
    height: 180px;
  }
  
  .slider-svg {
    display: block;
  }
  
  .slider-thumb {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    transition: transform 0.1s ease;
  }
  
  .slider-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 10;
  }
  
  .slider-info {
    margin-top: 20px;
    text-align: center;
  }
  
  .value-display {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 15px;
  }
  
  .value {
    color: #4a90e2;
    min-width: 40px;
    display: inline-block;
  }
  
  .slider-controls {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .slider-controls button {
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .slider-controls button:hover {
    background: #3a7bc8;
    transform: translateY(-2px);
  }
  
  .explanation {
    background: #f0f7ff;
    padding: 20px;
    border-radius: 12px;
    border-left: 4px solid #4a90e2;
  }
  
  .explanation h3 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  .explanation ul {
    padding-left: 20px;
    margin-bottom: 0;
  }
  
  .explanation li {
    margin-bottom: 8px;
    color: #34495e;
    line-height: 1.5;
  }
`;

// Add styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CurvedSliderD;