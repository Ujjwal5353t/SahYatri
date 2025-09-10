import React, { useEffect, useRef, useState } from 'react';

const EnhancedMap = ({ tourists }) => {
  const mapRef = useRef(null);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [mapStyle, setMapStyle] = useState('terrain');

  useEffect(() => {
    if (mapRef.current) {
      renderEnhancedMap();
    }
  }, [tourists, mapStyle]);

  const renderEnhancedMap = () => {
    const mapElement = mapRef.current;
    mapElement.innerHTML = '';
    
    // Create main SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.background = getMapBackground();
    
    // Add definitions for patterns and gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Terrain pattern
    const terrainPattern = createTerrainPattern();
    defs.appendChild(terrainPattern);
    
    // Water gradient
    const waterGradient = createWaterGradient();
    defs.appendChild(waterGradient);
    
    // Road pattern
    const roadPattern = createRoadPattern();
    defs.appendChild(roadPattern);
    
    svg.appendChild(defs);
    
    // Add terrain base
    const terrain = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    terrain.setAttribute('width', '100%');
    terrain.setAttribute('height', '100%');
    terrain.setAttribute('fill', 'url(#terrainPattern)');
    svg.appendChild(terrain);
    
    // Add geographical features
    addGeographicalFeatures(svg);
    
    // Add road network
    addRoadNetwork(svg);
    
    // Add safety zones
    addSafetyZones(svg);
    
    // Add tourist markers
    if (tourists && tourists.length > 0) {
      addTouristMarkers(svg);
    }
    
    // Add legend
    addMapLegend(svg);
    
    mapElement.appendChild(svg);
  };

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #2d3748 100%)';
      case 'terrain':
        return 'linear-gradient(135deg, #1a202c 0%, #2d3748 30%, #4a5568 70%, #2d3748 100%)';
      case 'road':
        return 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)';
      default:
        return 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)';
    }
  };

  const createTerrainPattern = () => {
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'terrainPattern');
    pattern.setAttribute('width', '60');
    pattern.setAttribute('height', '60');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    // Base rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '60');
    rect.setAttribute('height', '60');
    rect.setAttribute('fill', '#1e293b');
    pattern.appendChild(rect);
    
    // Terrain contours
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M0,30 Q15,15 30,30 T60,30');
    path1.setAttribute('stroke', 'rgba(59, 130, 246, 0.15)');
    path1.setAttribute('stroke-width', '1');
    path1.setAttribute('fill', 'none');
    pattern.appendChild(path1);
    
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M0,45 Q20,35 40,45 T60,45');
    path2.setAttribute('stroke', 'rgba(59, 130, 246, 0.1)');
    path2.setAttribute('stroke-width', '1');
    path2.setAttribute('fill', 'none');
    pattern.appendChild(path2);
    
    return pattern;
  };

  const createWaterGradient = () => {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'waterGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#1e40af');
    stop1.setAttribute('stop-opacity', '0.8');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#3b82f6');
    stop2.setAttribute('stop-opacity', '0.6');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    
    return gradient;
  };

  const createRoadPattern = () => {
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'roadPattern');
    pattern.setAttribute('width', '20');
    pattern.setAttribute('height', '20');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '20');
    rect.setAttribute('height', '20');
    rect.setAttribute('fill', 'transparent');
    pattern.appendChild(rect);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '10');
    line.setAttribute('x2', '20');
    line.setAttribute('y2', '10');
    line.setAttribute('stroke', 'rgba(156, 163, 175, 0.3)');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '5,5');
    pattern.appendChild(line);
    
    return pattern;
  };

  const addGeographicalFeatures = (svg) => {
    const mapRect = mapRef.current.getBoundingClientRect();
    
    // Brahmaputra River
    const river = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    river.setAttribute('d', `M 0 ${mapRect.height * 0.6} Q ${mapRect.width * 0.3} ${mapRect.height * 0.5} ${mapRect.width * 0.6} ${mapRect.height * 0.65} T ${mapRect.width} ${mapRect.height * 0.7}`);
    river.setAttribute('stroke', 'url(#waterGradient)');
    river.setAttribute('stroke-width', '12');
    river.setAttribute('fill', 'none');
    river.setAttribute('opacity', '0.8');
    svg.appendChild(river);
    
    // Hills/Mountains
    for (let i = 0; i < 5; i++) {
      const hill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const x = (mapRect.width / 6) * (i + 1);
      const y = mapRect.height * 0.3;
      const height = 40 + Math.random() * 30;
      const width = 60 + Math.random() * 40;
      
      hill.setAttribute('d', `M ${x - width/2} ${y} L ${x} ${y - height} L ${x + width/2} ${y} Z`);
      hill.setAttribute('fill', 'rgba(34, 197, 94, 0.2)');
      hill.setAttribute('stroke', 'rgba(34, 197, 94, 0.4)');
      hill.setAttribute('stroke-width', '1');
      svg.appendChild(hill);
    }
    
    // Forest areas
    for (let i = 0; i < 8; i++) {
      const forest = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      forest.setAttribute('cx', Math.random() * mapRect.width);
      forest.setAttribute('cy', Math.random() * mapRect.height);
      forest.setAttribute('r', 20 + Math.random() * 30);
      forest.setAttribute('fill', 'rgba(34, 197, 94, 0.15)');
      forest.setAttribute('stroke', 'rgba(34, 197, 94, 0.3)');
      forest.setAttribute('stroke-width', '1');
      svg.appendChild(forest);
    }
  };

  const addRoadNetwork = (svg) => {
    const mapRect = mapRef.current.getBoundingClientRect();
    
    // Main highway
    const highway = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    highway.setAttribute('d', `M 0 ${mapRect.height * 0.4} Q ${mapRect.width * 0.5} ${mapRect.height * 0.35} ${mapRect.width} ${mapRect.height * 0.45}`);
    highway.setAttribute('stroke', 'rgba(156, 163, 175, 0.6)');
    highway.setAttribute('stroke-width', '4');
    highway.setAttribute('fill', 'none');
    svg.appendChild(highway);
    
    // Secondary roads
    const roads = [
      `M ${mapRect.width * 0.2} 0 Q ${mapRect.width * 0.25} ${mapRect.height * 0.5} ${mapRect.width * 0.3} ${mapRect.height}`,
      `M ${mapRect.width * 0.7} 0 Q ${mapRect.width * 0.65} ${mapRect.height * 0.4} ${mapRect.width * 0.8} ${mapRect.height}`,
      `M 0 ${mapRect.height * 0.2} Q ${mapRect.width * 0.4} ${mapRect.height * 0.15} ${mapRect.width} ${mapRect.height * 0.25}`
    ];
    
    roads.forEach(roadPath => {
      const road = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      road.setAttribute('d', roadPath);
      road.setAttribute('stroke', 'rgba(156, 163, 175, 0.4)');
      road.setAttribute('stroke-width', '2');
      road.setAttribute('fill', 'none');
      road.setAttribute('stroke-dasharray', '10,5');
      svg.appendChild(road);
    });
  };

  const addSafetyZones = (svg) => {
    const mapRect = mapRef.current.getBoundingClientRect();
    
    // Safe zones (green)
    const safeZones = [
      { x: mapRect.width * 0.2, y: mapRect.height * 0.3, r: 80 },
      { x: mapRect.width * 0.7, y: mapRect.height * 0.7, r: 100 }
    ];
    
    safeZones.forEach(zone => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', zone.x);
      circle.setAttribute('cy', zone.y);
      circle.setAttribute('r', zone.r);
      circle.setAttribute('fill', 'rgba(34, 197, 94, 0.1)');
      circle.setAttribute('stroke', 'rgba(34, 197, 94, 0.3)');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('stroke-dasharray', '5,5');
      svg.appendChild(circle);
    });
    
    // Caution zones (yellow)
    const cautionZones = [
      { x: mapRect.width * 0.5, y: mapRect.height * 0.5, r: 90 }
    ];
    
    cautionZones.forEach(zone => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', zone.x);
      circle.setAttribute('cy', zone.y);
      circle.setAttribute('r', zone.r);
      circle.setAttribute('fill', 'rgba(251, 191, 36, 0.1)');
      circle.setAttribute('stroke', 'rgba(251, 191, 36, 0.4)');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('stroke-dasharray', '5,5');
      svg.appendChild(circle);
    });
    
    // Danger zones (red)
    const dangerZones = [
      { x: mapRect.width * 0.15, y: mapRect.height * 0.8, r: 70 },
      { x: mapRect.width * 0.85, y: mapRect.height * 0.2, r: 60 }
    ];
    
    dangerZones.forEach(zone => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', zone.x);
      circle.setAttribute('cy', zone.y);
      circle.setAttribute('r', zone.r);
      circle.setAttribute('fill', 'rgba(239, 68, 68, 0.1)');
      circle.setAttribute('stroke', 'rgba(239, 68, 68, 0.4)');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('stroke-dasharray', '5,5');
      svg.appendChild(circle);
    });
  };

  const addTouristMarkers = (svg) => {
    if (!tourists) return;
    
    const mapRect = mapRef.current.getBoundingClientRect();
    const centerLat = 26.1445;
    const centerLng = 91.7362;
    const scale = 8000;
    
    tourists.forEach((tourist, index) => {
      const deltaLat = tourist.location.lat - centerLat;
      const deltaLng = tourist.location.lng - centerLng;
      
      const x = (mapRect.width / 2) + (deltaLng * scale);
      const y = (mapRect.height / 2) - (deltaLat * scale);
      
      const clampedX = Math.max(30, Math.min(mapRect.width - 30, x));
      const clampedY = Math.max(30, Math.min(mapRect.height - 30, y));
      
      const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      markerGroup.classList.add('tourist-marker');
      markerGroup.style.cursor = 'pointer';
      
      // Enhanced marker design
      const shadowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shadowCircle.setAttribute('cx', clampedX + 2);
      shadowCircle.setAttribute('cy', clampedY + 2);
      shadowCircle.setAttribute('r', '12');
      shadowCircle.setAttribute('fill', 'rgba(0, 0, 0, 0.3)');
      
      const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outerCircle.setAttribute('cx', clampedX);
      outerCircle.setAttribute('cy', clampedY);
      outerCircle.setAttribute('r', '12');
      outerCircle.setAttribute('fill', 'white');
      outerCircle.setAttribute('opacity', '0.9');
      
      const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      innerCircle.setAttribute('cx', clampedX);
      innerCircle.setAttribute('cy', clampedY);
      innerCircle.setAttribute('r', '8');
      
      const color = tourist.zone_type === 'safe' ? '#22c55e' : 
                   tourist.zone_type === 'caution' ? '#f59e0b' : '#ef4444';
      innerCircle.setAttribute('fill', color);
      
      // Tourist icon
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      icon.setAttribute('x', clampedX);
      icon.setAttribute('y', clampedY + 4);
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('fill', 'white');
      icon.setAttribute('font-size', '10');
      icon.setAttribute('font-weight', 'bold');
      icon.textContent = '👤';
      
      // Pulse animation
      const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseCircle.setAttribute('cx', clampedX);
      pulseCircle.setAttribute('cy', clampedY);
      pulseCircle.setAttribute('r', '12');
      pulseCircle.setAttribute('fill', 'none');
      pulseCircle.setAttribute('stroke', color);
      pulseCircle.setAttribute('stroke-width', '2');
      pulseCircle.setAttribute('opacity', '0.6');
      
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'r');
      animate.setAttribute('values', '12;25;12');
      animate.setAttribute('dur', '3s');
      animate.setAttribute('repeatCount', 'indefinite');
      
      const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateOpacity.setAttribute('attributeName', 'opacity');
      animateOpacity.setAttribute('values', '0.6;0;0.6');
      animateOpacity.setAttribute('dur', '3s');
      animateOpacity.setAttribute('repeatCount', 'indefinite');
      
      pulseCircle.appendChild(animate);
      pulseCircle.appendChild(animateOpacity);
      
      markerGroup.appendChild(shadowCircle);
      markerGroup.appendChild(outerCircle);
      markerGroup.appendChild(innerCircle);
      markerGroup.appendChild(icon);
      markerGroup.appendChild(pulseCircle);
      
      // Click handler
      markerGroup.addEventListener('click', () => {
        setSelectedTourist(tourist);
      });
      
      // Hover effects
      markerGroup.addEventListener('mouseenter', (e) => {
        showTooltip(e, tourist);
        outerCircle.setAttribute('r', '14');
        innerCircle.setAttribute('r', '10');
      });
      
      markerGroup.addEventListener('mouseleave', () => {
        hideTooltip();
        outerCircle.setAttribute('r', '12');
        innerCircle.setAttribute('r', '8');
      });
      
      svg.appendChild(markerGroup);
    });
  };

  const addMapLegend = (svg) => {
    const mapRect = mapRef.current.getBoundingClientRect();
    
    // Legend background
    const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    legendBg.setAttribute('x', mapRect.width - 160);
    legendBg.setAttribute('y', 10);
    legendBg.setAttribute('width', '150');
    legendBg.setAttribute('height', '120');
    legendBg.setAttribute('fill', 'rgba(15, 23, 42, 0.9)');
    legendBg.setAttribute('stroke', 'rgba(59, 130, 246, 0.3)');
    legendBg.setAttribute('stroke-width', '1');
    legendBg.setAttribute('rx', '8');
    svg.appendChild(legendBg);
    
    // Legend title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', mapRect.width - 85);
    title.setAttribute('y', 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', 'white');
    title.setAttribute('font-size', '12');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Legend';
    svg.appendChild(title);
    
    // Legend items
    const legendItems = [
      { color: '#22c55e', label: 'Safe Zone', y: 50 },
      { color: '#f59e0b', label: 'Caution Zone', y: 70 },
      { color: '#ef4444', label: 'Danger Zone', y: 90 },
      { color: '#3b82f6', label: 'Water Body', y: 110 }
    ];
    
    legendItems.forEach(item => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', mapRect.width - 140);
      circle.setAttribute('cy', item.y);
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', item.color);
      svg.appendChild(circle);
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', mapRect.width - 125);
      label.setAttribute('y', item.y + 4);
      label.setAttribute('fill', 'white');
      label.setAttribute('font-size', '10');
      label.textContent = item.label;
      svg.appendChild(label);
    });
  };

  const showTooltip = (e, tourist) => {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'enhanced-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: rgba(15, 23, 42, 0.95);
      color: white;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(59, 130, 246, 0.3);
      backdrop-filter: blur(10px);
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
      max-width: 250px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    `;
    
    tooltip.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px; color: #60a5fa;">${tourist.name}</div>
      <div style="margin-bottom: 4px;">📍 ${tourist.nationality}</div>
      <div style="margin-bottom: 4px;">🏨 ${tourist.hotel_name}</div>
      <div style="margin-bottom: 4px;">📊 Safety Score: <span style="font-weight: 600;">${tourist.safety_score}/100</span></div>
      <div style="margin-bottom: 4px;">⚠️ Zone: <span style="color: ${tourist.zone_type === 'safe' ? '#22c55e' : tourist.zone_type === 'caution' ? '#f59e0b' : '#ef4444'}; font-weight: 600; text-transform: capitalize;">${tourist.zone_type}</span></div>
      <div style="margin-bottom: 4px;">📱 Status: <span style="color: ${tourist.status === 'active' ? '#22c55e' : '#ef4444'}; font-weight: 600;">${tourist.status}</span></div>
      <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">📝 ${tourist.itinerary}</div>
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = `${e.clientX - rect.width / 2}px`;
    tooltip.style.top = `${e.clientY - rect.height - 15}px`;
  };

  const hideTooltip = () => {
    const tooltip = document.getElementById('enhanced-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  };

  return (
    <div className="relative">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          className="bg-slate-800/90 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm"
        >
          <option value="terrain">Terrain</option>
          <option value="satellite">Satellite</option>
          <option value="road">Road</option>
        </select>
        
        <button className="bg-slate-800/90 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm hover:bg-slate-700/90 transition-colors">
          🔍 Zoom
        </button>
        
        <button className="bg-slate-800/90 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm backdrop-blur-sm hover:bg-slate-700/90 transition-colors">
          📍 Center
        </button>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '500px', 
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          position: 'relative'
        }}
      />

      {/* Tourist Detail Popup */}
      {selectedTourist && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-slate-900/95 border border-blue-500/30 rounded-xl p-6 max-w-md mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{selectedTourist.name}</h3>
              <button
                onClick={() => setSelectedTourist(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-gray-300">
              <p><strong>Nationality:</strong> {selectedTourist.nationality}</p>
              <p><strong>Hotel:</strong> {selectedTourist.hotel_name}</p>
              <p><strong>Safety Score:</strong> {selectedTourist.safety_score}/100</p>
              <p><strong>Zone:</strong> <span className={`capitalize font-semibold ${
                selectedTourist.zone_type === 'safe' ? 'text-green-400' :
                selectedTourist.zone_type === 'caution' ? 'text-yellow-400' : 'text-red-400'
              }`}>{selectedTourist.zone_type}</span></p>
              <p><strong>Status:</strong> <span className={`font-semibold ${
                selectedTourist.status === 'active' ? 'text-green-400' : 'text-red-400'
              }`}>{selectedTourist.status}</span></p>
              <p><strong>Itinerary:</strong> {selectedTourist.itinerary}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                View Details
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMap;