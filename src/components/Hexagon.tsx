import React from 'react';
import { motion } from 'framer-motion';

interface HexagonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'lg';
  layoutId?: string;
}

export const Hexagon: React.FC<HexagonProps> = ({ 
  children, 
  isActive = false, 
  onClick, 
  size = 'lg',
  layoutId 
}) => {
  // Dimensions - Pixel perfect match with image
  const width = size === 'lg' ? 200 : 74;
  const height = size === 'lg' ? 250 : 74;
  
  // Stroke widths - Same for all, only size changes
  const strokeWidth = size === 'lg' ? 3 : 2.5;
  
  // Gold color for all hexagons
  const goldColor = '#AC9A52';
  
  // Light purple background for all hexagons with transparency
  const lightPurpleFill = 'rgba(139, 92, 246, 0.2)'; // Light purple with transparency

  // Hexagon Path with rounded vertices using actual curves
  // Corner radius for smooth rounded vertices - increased for more visible rounding
  const cornerRadius = size === 'lg' ? 8 : 8;
  
  // Hexagon vertices (flat top/bottom)
  const vertices = [
    [20, 3],   // Top left
    [80, 3],   // Top right
    [105, 50],  // Right
    [80, 97],  // Bottom right
    [20, 97],  // Bottom left
    [-5, 50]    // Left
  ];
  
  // Create path with rounded corners using quadratic curves
  const createRoundedHexagonPath = () => {
    let path = '';
    const numVertices = vertices.length;
    
    for (let i = 0; i < numVertices; i++) {
      const current = vertices[i];
      const next = vertices[(i + 1) % numVertices];
      const prev = vertices[(i - 1 + numVertices) % numVertices];
      
      // Calculate direction vectors
      const dx1 = current[0] - prev[0];
      const dy1 = current[1] - prev[1];
      const dx2 = next[0] - current[0];
      const dy2 = next[1] - current[1];
      
      // Normalize direction vectors
      const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      
      if (len1 === 0 || len2 === 0) continue;
      
      const nx1 = dx1 / len1;
      const ny1 = dy1 / len1;
      const nx2 = dx2 / len2;
      const ny2 = dy2 / len2;
      
      // Calculate points before and after the corner
      const cp1x = current[0] - nx1 * cornerRadius;
      const cp1y = current[1] - ny1 * cornerRadius;
      const cp2x = current[0] + nx2 * cornerRadius;
      const cp2y = current[1] + ny2 * cornerRadius;
      
      if (i === 0) {
        // Move to first point (before the first corner)
        path += `M ${cp1x},${cp1y}`;
      } else {
        // Draw line to the corner start
        path += ` L ${cp1x},${cp1y}`;
      }
      
      // Draw quadratic curve around the corner
      path += ` Q ${current[0]},${current[1]} ${cp2x},${cp2y}`;
    }
    
    path += ' Z';
    return path;
  };
  
  const hexPath = createRoundedHexagonPath();
  
  // Create inner shadow path (slightly smaller hexagon for inner shadow effect)
  const createInnerShadowPath = () => {
    const innerOffset = size === 'lg' ? 2 : 1;
    const innerVertices = vertices.map(([x, y]) => {
      const centerX = 50;
      const centerY = 50;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const newDistance = distance - innerOffset;
      return [centerX + Math.cos(angle) * newDistance, centerY + Math.sin(angle) * newDistance];
    });
    
    let path = '';
    for (let i = 0; i < innerVertices.length; i++) {
      const current = innerVertices[i];
      const next = innerVertices[(i + 1) % innerVertices.length];
      const prev = innerVertices[(i - 1 + innerVertices.length) % innerVertices.length];
      
      const dx1 = current[0] - prev[0];
      const dy1 = current[1] - prev[1];
      const dx2 = next[0] - current[0];
      const dy2 = next[1] - current[1];
      
      const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      
      if (len1 === 0 || len2 === 0) continue;
      
      const nx1 = dx1 / len1;
      const ny1 = dy1 / len1;
      const nx2 = dx2 / len2;
      const ny2 = dy2 / len2;
      
      const cp1x = current[0] - nx1 * (cornerRadius - 0.5);
      const cp1y = current[1] - ny1 * (cornerRadius - 0.5);
      const cp2x = current[0] + nx2 * (cornerRadius - 0.5);
      const cp2y = current[1] + ny2 * (cornerRadius - 0.5);
      
      if (i === 0) {
        path += `M ${cp1x},${cp1y}`;
      } else {
        path += ` L ${cp1x},${cp1y}`;
      }
      
      path += ` Q ${current[0]},${current[1]} ${cp2x},${cp2y}`;
    }
    
    path += ' Z';
    return path;
  };
  
  const innerShadowPath = createInnerShadowPath();
  const uniqueId = layoutId || `hex-${Math.random().toString(36).substr(2, 9)}`;
  const gradientId = `innerShadowGradient-${uniqueId}`;
  const maskId = `innerShadowMask-${uniqueId}`;
  
  return (
    <motion.div 
      layoutId={layoutId}
      className={`relative flex items-center justify-center shrink-0 cursor-pointer transition-transform ${onClick ? 'hover:scale-105 active:scale-95' : ''}`}
      style={{ width, height }}
      onClick={onClick}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        className="absolute inset-0 z-10 overflow-visible"
        style={{ 
          filter: size === 'lg' 
            ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' 
            : 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))' 
        }}
      >
        <defs>
          {/* Radial gradient for inner shadow - strong at edges, transparent at center */}
          <radialGradient id={gradientId} cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="40%" stopColor="rgba(0, 0, 0, 0)" />
            <stop offset="70%" stopColor="rgba(0, 0, 0, 0.2)" />
            <stop offset="85%" stopColor="rgba(0, 0, 0, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.6)" />
          </radialGradient>
        </defs>
        
        {/* Background Fill - Light purple for all hexagons */}
        <path 
          d={hexPath}
          fill={lightPurpleFill}
          stroke="none"
        />
        
        {/* Inner shadow - gradient from edges inward */}
        <path 
          d={hexPath}
          fill={`url(#${gradientId})`}
        />
        
        {/* Gold border */}
        <path 
          d={hexPath}
          fill="none"
          stroke={goldColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* White light border - very thin on top of gold border */}
        <path 
          d={hexPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={size === 'lg' ? 0.8 : 0.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* Content */}
      <div className="relative z-20 text-white flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};

