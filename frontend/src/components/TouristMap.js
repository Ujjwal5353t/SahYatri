import React, { useEffect, useRef } from 'react';

const TouristMap = ({ tourists }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize map when component mounts
    initializeMap();
    
    return () => {
      // Cleanup when component unmounts
      if (mapInstance.current) {
        markersRef.current.forEach(marker => {
          if (marker.setMap) marker.setMap(null);
        });
        markersRef.current = [];
      }
    };
  }, []);

  useEffect(() => {
    // Update markers when tourists data changes
    if (mapInstance.current && tourists) {
      updateMarkers();
    }
  }, [tourists]);

  const initializeMap = () => {
    if (!window.google) {
      // Fallback to basic map visualization if Google Maps is not available
      renderBasicMap();
      return;
    }

    // Initialize Google Maps
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 26.1445, lng: 91.7362 }, // Guwahati, Assam
      zoom: 12,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [{"color": "#1d2c4d"}]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#8ec3b9"}]
        },
        {
          "elementType": "labels.text.stroke", 
          "stylers": [{"color": "#1a3646"}]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#4b6878"}]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#334e87"}]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#6f9ba4"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{"color": "#304a7d"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill", 
          "stylers": [{"color": "#98a5be"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{"color": "#1d2c4d"}]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{"color": "#0e1626"}]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#4e6d70"}]
        }
      ]
    });
  };

  const renderBasicMap = () => {
    // Create a basic map visualization without Google Maps API
    const mapElement = mapRef.current;
    mapElement.innerHTML = '';
    
    // Create SVG-based map
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.background = 'linear-gradient(135deg, #1e293b, #334155)';
    
    // Add grid pattern
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'grid');
    pattern.setAttribute('width', '40');
    pattern.setAttribute('height', '40');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 40 0 L 0 0 0 40');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(59, 130, 246, 0.1)');
    path.setAttribute('stroke-width', '1');
    
    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(rect);
    
    // Add river representation
    const river = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    river.setAttribute('d', 'M 0 200 Q 200 150 400 180 Q 600 200 800 170');
    river.setAttribute('fill', 'none');
    river.setAttribute('stroke', '#3b82f6');
    river.setAttribute('stroke-width', '8');
    river.setAttribute('opacity', '0.6');
    svg.appendChild(river);
    
    mapElement.appendChild(svg);
    
    // Add tourist markers
    if (tourists) {
      updateBasicMapMarkers(svg);
    }
  };

  const updateBasicMapMarkers = (svg) => {
    // Remove existing tourist markers
    const existingMarkers = svg.querySelectorAll('.tourist-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    const mapRect = mapRef.current.getBoundingClientRect();
    const centerLat = 26.1445;
    const centerLng = 91.7362;
    const scale = 8000; // Adjust this to control marker spread
    
    tourists.forEach((tourist, index) => {
      const deltaLat = tourist.location.lat - centerLat;
      const deltaLng = tourist.location.lng - centerLng;
      
      const x = (mapRect.width / 2) + (deltaLng * scale);
      const y = (mapRect.height / 2) - (deltaLat * scale);
      
      // Ensure markers are within bounds
      const clampedX = Math.max(20, Math.min(mapRect.width - 20, x));
      const clampedY = Math.max(20, Math.min(mapRect.height - 20, y));
      
      const markerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      markerGroup.classList.add('tourist-marker');
      markerGroup.style.cursor = 'pointer';
      
      // Marker circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', clampedX);
      circle.setAttribute('cy', clampedY);
      circle.setAttribute('r', '8');
      
      const color = tourist.zone_type === 'safe' ? '#22c55e' : 
                   tourist.zone_type === 'caution' ? '#f59e0b' : '#ef4444';
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      
      // Pulsing animation
      const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseCircle.setAttribute('cx', clampedX);
      pulseCircle.setAttribute('cy', clampedY);
      pulseCircle.setAttribute('r', '8');
      pulseCircle.setAttribute('fill', 'none');
      pulseCircle.setAttribute('stroke', color);
      pulseCircle.setAttribute('stroke-width', '2');
      pulseCircle.setAttribute('opacity', '0.6');
      
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'r');
      animate.setAttribute('values', '8;20;8');
      animate.setAttribute('dur', '2s');
      animate.setAttribute('repeatCount', 'indefinite');
      
      const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animateOpacity.setAttribute('attributeName', 'opacity');
      animateOpacity.setAttribute('values', '0.6;0;0.6');
      animateOpacity.setAttribute('dur', '2s');
      animateOpacity.setAttribute('repeatCount', 'indefinite');
      
      pulseCircle.appendChild(animate);
      pulseCircle.appendChild(animateOpacity);
      
      markerGroup.appendChild(pulseCircle);
      markerGroup.appendChild(circle);
      
      // Add tooltip
      markerGroup.addEventListener('mouseenter', (e) => {
        showTooltip(e, tourist);
      });
      
      markerGroup.addEventListener('mouseleave', hideTooltip);
      
      svg.appendChild(markerGroup);
    });
  };

  const updateMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.setMap) marker.setMap(null);
    });
    markersRef.current = [];

    if (!window.google || !tourists) {
      // Update basic map markers if Google Maps is not available
      const svg = mapRef.current.querySelector('svg');
      if (svg) {
        updateBasicMapMarkers(svg);
      }
      return;
    }

    // Create new markers for Google Maps
    tourists.forEach((tourist) => {
      const marker = new window.google.maps.Marker({
        position: { lat: tourist.location.lat, lng: tourist.location.lng },
        map: mapInstance.current,
        title: tourist.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: tourist.zone_type === 'safe' ? '#22c55e' : 
                    tourist.zone_type === 'caution' ? '#f59e0b' : '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="color: #1f2937; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600;">${tourist.name}</h3>
            <p style="margin: 0 0 4px 0;"><strong>Nationality:</strong> ${tourist.nationality}</p>
            <p style="margin: 0 0 4px 0;"><strong>Safety Score:</strong> ${tourist.safety_score}/100</p>
            <p style="margin: 0 0 4px 0;"><strong>Zone:</strong> ${tourist.zone_type}</p>
            <p style="margin: 0 0 4px 0;"><strong>Hotel:</strong> ${tourist.hotel_name}</p>
            <p style="margin: 0;"><strong>Status:</strong> ${tourist.status}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  const showTooltip = (e, tourist) => {
    // Remove existing tooltips
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'tourist-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: rgba(15, 23, 42, 0.95);
      color: white;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid rgba(59, 130, 246, 0.3);
      backdrop-filter: blur(10px);
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
      max-width: 200px;
    `;
    
    tooltip.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px;">${tourist.name}</div>
      <div>Nationality: ${tourist.nationality}</div>
      <div>Safety Score: ${tourist.safety_score}/100</div>
      <div>Zone: ${tourist.zone_type}</div>
      <div>Hotel: ${tourist.hotel_name}</div>
      <div>Status: ${tourist.status}</div>
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.left = `${e.clientX - rect.width / 2}px`;
    tooltip.style.top = `${e.clientY - rect.height - 10}px`;
  };

  const hideTooltip = () => {
    const tooltip = document.getElementById('tourist-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  };

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '400px', 
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e293b, #334155)'
      }}
    />
  );
};

export default TouristMap;