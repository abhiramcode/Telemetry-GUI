import React, { useState, useRef, useEffect } from 'react';
import CurvedSliderD from './SliderDemo';

const CurvedSlider = ({value=50}) => {
//   const [value, setValue] = useState(50);
  const sliderRef = useRef(null);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  
  // Calculate the curve path data
  const curvePath = "M 10 80 C 50 10, 150 10, 190 80";
  
  // Initialize path length
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);
  
  // Calculate thumb position along the curve
  const calculateThumbPosition = () => {
    if (!pathRef.current || pathLength === 0) return { x: 100, y: 80 };
    
    // Calculate position based on value (0-100)
    const position = (value / 100) * pathLength;
    const point = pathRef.current.getPointAtLength(position);
    
    return point;
  };
  
  const thumbPosition = calculateThumbPosition();
  
  // Calculate the dash array for center-fill effect
  const calculateDashArray = () => {
    if (pathLength === 0) return "0, 0";
    
    const center = pathLength / 2;
    const valuePosition = (value / 100) * pathLength;
    
    // Calculate how far we are from center (0 to 50)
    const distanceFromCenter = Math.abs(50 - value);
    const progressLength = (distanceFromCenter / 50) * center;
    
    if (value > 50) {
      // Right side fill
      return `0, ${center}, ${progressLength}`;
    } else if (value < 50) {
      // Left side fill
      return `${center - progressLength}, ${progressLength}, ${pathLength - center}`;
    } else {
      // Center (no fill)
      return `0, ${center}, ${center}`;
    }
  };
  
  const dashArray = calculateDashArray();

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '500px', 
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#1e1e2e',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#f5f5f7',
        marginBottom: '30px',
        fontWeight: '500',
        fontSize: '1.8rem'
      }}>
        Curved Slider
      </h2>
      
      <div style={{ position: 'relative', height: '100%' }}>
        {/* <svg width="100%" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible' }}> */}
          {/* Background track */}
          {/* <path
            ref={pathRef}
            d={curvePath}
            fill="none"
            stroke="#3a3a4a"
            strokeWidth="10"
            strokeLinecap="round"
          /> */}
          
          {/* Active track - fills from center */}
          {/* <path
            d={curvePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={dashArray}
          /> */}
          
          {/* Thumb */}
          {/* <circle
            cx={thumbPosition.x}
            cy={thumbPosition.y}
            r="12"
            fill="#ffffff"
            stroke="#6366f1"
            strokeWidth="3"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
        </svg> */}
        
        <CurvedSliderD 
            value={value} 
            // onChange={(e) => setValue(parseInt(e.target.value))} 
            />
        
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            // marginTop: '30px',
            // padding: '0 10px'
        }}>
            {/* <span style={{ color: '#a1a1aa' }}>0</span> */}
            <div style={{
            background: '#2d2d3a',
            margin: 'auto',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#e0e0e8',
            fontWeight: '500'
            }}>
            ROLL: <span style={{ color: '#818cf8' }}>{value}</span>
            </div>
            {/* <span style={{ color: '#a1a1aa' }}>100</span> */}
        </div>
      </div>
      
      
      
      {/* <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: '#2d2d3a',
        borderRadius: '12px',
        color: '#d1d5db',
        fontSize: '0.9rem'
      }}>
        <h3 style={{ marginTop: '0', color: '#e0e0e8' }}>How it works:</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Slider track is curved with a concave downward shape</li>
          <li>Track fills from the center outward as you move the slider</li>
          <li>Thumb follows the curved path accurately</li>
          <li>Uses SVG path calculations for precise positioning</li>
          <li>Center-fill effect created with stroke-dasharray trickery</li>
        </ul>
      </div> */}
    </div>
  );
};

export default CurvedSlider;