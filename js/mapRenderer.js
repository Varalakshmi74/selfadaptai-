// Tactical Interactive Canvas Map Visualizer
// Renders responsive, animated tactical maps with multi-facility layers:
// Accidents, Nearby Hospitals, Police Stations, Fire Stations, and Flood Shelters

class TacticalMapRenderer {
  constructor() {
    this.animationFrames = {};
    this.activeFilter = 'all'; // 'all' | 'hospitals' | 'police' | 'fire' | 'shelters'
  }

  setFilter(filter) {
    this.activeFilter = filter;
  }

  // Setup retina/high-DPI canvas
  setupCanvas(canvas) {
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 380;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width, height };
  }

  // Draw tactical road grid
  drawTacticalGrid(ctx, width, height, bgColor = '#090E18') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Minor grid
    ctx.strokeStyle = '#172033';
    ctx.lineWidth = 1;
    const gridSize = 35;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Major thoroughfares & expressways
    ctx.strokeStyle = '#22324D';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Main Arterial (East-West Highway)
    ctx.beginPath();
    ctx.moveTo(30, height * 0.5);
    ctx.lineTo(width * 0.45, height * 0.5);
    ctx.lineTo(width * 0.72, height * 0.25);
    ctx.lineTo(width - 30, height * 0.25);
    ctx.stroke();

    // Bypass Highway (South Branch)
    ctx.beginPath();
    ctx.moveTo(width * 0.45, height * 0.5);
    ctx.lineTo(width * 0.58, height * 0.78);
    ctx.lineTo(width - 40, height * 0.78);
    ctx.stroke();

    // North Sector Connector
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.85);
    ctx.lineTo(width * 0.25, height * 0.2);
    ctx.lineTo(width * 0.65, height * 0.2);
    ctx.stroke();

    // Lane markings
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);

    ctx.beginPath();
    ctx.moveTo(30, height * 0.5);
    ctx.lineTo(width * 0.45, height * 0.5);
    ctx.lineTo(width * 0.72, height * 0.25);
    ctx.lineTo(width - 30, height * 0.25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width * 0.45, height * 0.5);
    ctx.lineTo(width * 0.58, height * 0.78);
    ctx.lineTo(width - 40, height * 0.78);
    ctx.stroke();

    ctx.setLineDash([]);
  }

  // Draw Facility Pin with badge
  drawFacilityPin(ctx, x, y, icon, label, sublabel, color, isActive = false, time = 0) {
    // Ambient Pulse if active
    if (isActive) {
      ctx.beginPath();
      ctx.arc(x, y, 18 + Math.sin(time * 5) * 5, 0, Math.PI * 2);
      ctx.fillStyle = color + '33';
      ctx.fill();
    }

    // Outer circle
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Icon text
    ctx.font = '12px Apple Color Emoji, Segoe UI Emoji, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x, y);

    // Label card bubble
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    const textWidth = ctx.measureText(label).width;
    const boxW = Math.max(textWidth + 14, 80);
    const boxH = sublabel ? 28 : 18;
    const boxX = x - boxW / 2;
    const boxY = y - boxH - 14;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(label, boxX + 6, boxY + 12);

    if (sublabel) {
      ctx.fillStyle = color;
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(sublabel, boxX + 6, boxY + 23);
    }
  }

  // =========================================================================
  // 1. ACCIDENT & EMERGENCY FACILITIES COMPREHENSIVE MAP
  // =========================================================================
  renderAccidentMap(canvasId, isHospitalDiverted = false, activeFilter = 'all') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = this.setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    let time = 0;
    const animate = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Draw Base Road Network Grid
      this.drawTacticalGrid(ctx, width, height, '#0B1120');

      // CRASH SITE PIN (Accident Location)
      const crashX = width * 0.25;
      const crashY = height * 0.5;

      // Crash Incident Danger Zone Pulse
      ctx.beginPath();
      ctx.arc(crashX, crashY, 22 + Math.sin(time * 5) * 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(crashX, crashY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.font = '14px Apple Color Emoji, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💥', crashX, crashY);

      // Crash Site Tag
      ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
      ctx.beginPath();
      ctx.roundRect(crashX - 65, crashY - 38, 130, 22, 4);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CRASH SITE: KM 42', crashX, crashY - 24);

      // ---------------------------------------------------------------------
      // EMERGENCY FACILITIES PINS
      // ---------------------------------------------------------------------
      const fac = DISASTER_DATA.facilities;

      // 1. HOSPITALS (🏥)
      if (activeFilter === 'all' || activeFilter === 'hospitals') {
        const h1X = width * fac.hospitals[0].mapX;
        const h1Y = height * fac.hospitals[0].mapY;
        const h1Sub = isHospitalDiverted ? 'ICU FULL (DIVERT)' : '3 ICU BEDS (OPTIMAL)';
        const h1Color = isHospitalDiverted ? '#64748B' : '#10B981';
        this.drawFacilityPin(ctx, h1X, h1Y, '🏥', 'Apollo Trauma', h1Sub, h1Color, !isHospitalDiverted, time);

        const h2X = width * fac.hospitals[1].mapX;
        const h2Y = height * fac.hospitals[1].mapY;
        const h2Sub = isHospitalDiverted ? '⚡ ADAPTIVE ASSIGNED (8 BEDS)' : '8 ICU BEDS (STANDBY)';
        const h2Color = isHospitalDiverted ? '#38BDF8' : '#3B82F6';
        this.drawFacilityPin(ctx, h2X, h2Y, '🏥', 'St. Jude Apex', h2Sub, h2Color, isHospitalDiverted, time);

        const h3X = width * fac.hospitals[2].mapX;
        const h3Y = height * fac.hospitals[2].mapY;
        this.drawFacilityPin(ctx, h3X, h3Y, '🏥', 'Metro General', '0 Beds (Overloaded)', '#64748B', false, time);
      }

      // 2. POLICE STATIONS (🚓)
      if (activeFilter === 'all' || activeFilter === 'police') {
        const p1X = width * fac.policeStations[0].mapX;
        const p1Y = height * fac.policeStations[0].mapY;
        this.drawFacilityPin(ctx, p1X, p1Y, '🚓', 'Traffic HQ Div 1', 'Green Corridor Clear', '#60A5FA', false, time);

        const p2X = width * fac.policeStations[1].mapX;
        const p2Y = height * fac.policeStations[1].mapY;
        this.drawFacilityPin(ctx, p2X, p2Y, '🚓', 'Highway Patrol #12', 'On Scene Cordon', '#38BDF8', true, time);

        const p3X = width * fac.policeStations[2].mapX;
        const p3Y = height * fac.policeStations[2].mapY;
        this.drawFacilityPin(ctx, p3X, p3Y, '🚓', 'Sector 4 Precinct', 'Standby Patrol', '#94A3B8', false, time);
      }

      // 3. FIRE STATIONS (🚒)
      if (activeFilter === 'all' || activeFilter === 'fire') {
        const f1X = width * fac.fireStations[0].mapX;
        const f1Y = height * fac.fireStations[0].mapY;
        this.drawFacilityPin(ctx, f1X, f1Y, '🚒', 'Central Fire Station 1', 'Hydraulic Rescue', '#F97316', false, time);

        const f2X = width * fac.fireStations[1].mapX;
        const f2Y = height * fac.fireStations[1].mapY;
        this.drawFacilityPin(ctx, f2X, f2Y, '🚒', 'Hazmat Brigade #4', 'Foam Tender Ready', '#FB923C', false, time);
      }

      // 4. FLOOD SHELTERS (🏛️)
      if (activeFilter === 'all' || activeFilter === 'shelters') {
        const s1X = width * fac.floodShelters[0].mapX;
        const s1Y = height * fac.floodShelters[0].mapY;
        this.drawFacilityPin(ctx, s1X, s1Y, '🏛️', 'St. Xavier Arena', 'Cap: 80% (19.4m)', '#10B981', false, time);

        const s2X = width * fac.floodShelters[1].mapX;
        const s2Y = height * fac.floodShelters[1].mapY;
        this.drawFacilityPin(ctx, s2X, s2Y, '🏛️', 'North Civic Relief', 'Cap: 15% (28.1m)', '#34D399', false, time);
      }

      // ---------------------------------------------------------------------
      // ACTIVE AMBULANCE ROUTE & POLICE GREEN CORRIDOR
      // ---------------------------------------------------------------------
      ctx.save();
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);

      const hospAX = width * fac.hospitals[0].mapX;
      const hospAY = height * fac.hospitals[0].mapY;
      const hospBX = width * fac.hospitals[1].mapX;
      const hospBY = height * fac.hospitals[1].mapY;

      if (!isHospitalDiverted) {
        // Route to Hospital A (Apollo Memorial)
        ctx.strokeStyle = '#10B981';
        ctx.beginPath();
        ctx.moveTo(crashX, crashY);
        ctx.lineTo(width * 0.45, height * 0.5);
        ctx.lineTo(width * 0.72, height * 0.25);
        ctx.lineTo(hospAX, hospAY);
        ctx.stroke();

        // Moving Ambulance
        const progress = (time * 0.65) % 1;
        let ambX, ambY;
        if (progress < 0.5) {
          const t = progress / 0.5;
          ambX = crashX + (width * 0.45 - crashX) * t;
          ambY = crashY;
        } else {
          const t = (progress - 0.5) / 0.5;
          ambX = width * 0.45 + (hospAX - width * 0.45) * t;
          ambY = height * 0.5 + (hospAY - height * 0.5) * t;
        }
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(ambX, ambY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚑 ALS-108', ambX, ambY + 18);
      } else {
        // ADAPTIVE DIVERTED ROUTE TO HOSPITAL B (St. Jude)
        ctx.strokeStyle = '#38BDF8';
        ctx.beginPath();
        ctx.moveTo(crashX, crashY);
        ctx.lineTo(width * 0.45, height * 0.5);
        ctx.lineTo(width * 0.58, height * 0.78);
        ctx.lineTo(hospBX, hospBY);
        ctx.stroke();

        // Junction Reroute Alert Marker
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('🔀 AI REROUTE JUNCTION', width * 0.46, height * 0.46);

        // Moving Ambulance to B
        const progress = (time * 0.65) % 1;
        let ambX, ambY;
        if (progress < 0.5) {
          const t = progress / 0.5;
          ambX = crashX + (width * 0.45 - crashX) * t;
          ambY = crashY;
        } else {
          const t = (progress - 0.5) / 0.5;
          ambX = width * 0.45 + (hospBX - width * 0.45) * t;
          ambY = height * 0.5 + (hospBY - height * 0.5) * t;
        }
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(ambX, ambY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🚑 ALS-108 (DIVERTED)', ambX, ambY - 12);
      }
      ctx.restore();

      // Telemetry HUD overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(12, 12, 260, 56, 6);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('EMERGENCY DISPATCH & FACILITY LOCATOR', 20, 28);

      ctx.fillStyle = isHospitalDiverted ? '#38BDF8' : '#10B981';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(isHospitalDiverted ? '⚡ ADAPTIVE ROUTE: St. Jude Apex Medical' : '✔ GREEN CORRIDOR A-1 (Traffic Signals Synced)', 20, 46);

      ctx.fillStyle = '#64748B';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`Active Layer Filter: [${activeFilter.toUpperCase()}]`, 20, 60);

      if (this.animationFrames[canvasId]) {
        this.animationFrames[canvasId] = requestAnimationFrame(animate);
      }
    };

    if (this.animationFrames[canvasId]) cancelAnimationFrame(this.animationFrames[canvasId]);
    this.animationFrames[canvasId] = requestAnimationFrame(animate);
  }

  // =========================================================================
  // 2. FLOOD & SHELTER TACTICAL MAP
  // =========================================================================
  renderFloodMap(canvasId, isSurge = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = this.setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    let time = 0;
    const animate = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Dark tactical grid background
      ctx.fillStyle = '#080E1A';
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = '#172236';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // River / Canal watercourse (sinusoidal curve)
      ctx.beginPath();
      ctx.moveTo(0, height * 0.45);
      ctx.bezierCurveTo(width * 0.35, height * 0.35, width * 0.65, height * 0.65, width, height * 0.55);
      ctx.lineWidth = isSurge ? 48 : 30;
      ctx.strokeStyle = '#0284C7';
      ctx.stroke();

      // Flood Inundation Polygon (Zone)
      ctx.save();
      ctx.beginPath();
      const wave = Math.sin(time) * 6;
      if (!isSurge) {
        // Standard high flood zone
        ctx.fillStyle = 'rgba(6, 182, 212, 0.28)';
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
        ctx.lineWidth = 2;
        ctx.ellipse(width * 0.45, height * 0.5, 140 + wave, 70 + wave * 0.5, -0.2, 0, Math.PI * 2);
      } else {
        // SURGE ACTIVE: Expanded danger zone
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.95)';
        ctx.lineWidth = 3;
        ctx.ellipse(width * 0.48, height * 0.52, 220 + wave * 1.5, 120 + wave, -0.15, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Roads
      // Submerged Road (Riverbank Blvd)
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.3);
      ctx.lineTo(width * 0.55, height * 0.55);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Road Label
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('❌ SUBMERGED: Riverbank Blvd', width * 0.22, height * 0.38);

      // Safe Route Rendering
      ctx.beginPath();
      ctx.lineWidth = 4;
      if (!isSurge) {
        // Primary Route (via Sector 4 Ridge)
        ctx.moveTo(width * 0.15, height * 0.75);
        ctx.lineTo(width * 0.35, height * 0.85);
        ctx.lineTo(width * 0.68, height * 0.82);
        ctx.lineTo(width * 0.82, height * 0.7);
        ctx.strokeStyle = '#10B981';
        ctx.stroke();

        // Pulsing safe route marker
        const markerProgress = (Math.sin(time * 2) + 1) / 2;
        const currentX = width * 0.15 + (width * 0.67) * markerProgress;
        const currentY = height * 0.75 + (height * -0.05) * markerProgress;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('✔ PRIMARY SAFE ROUTE', width * 0.38, height * 0.92);
      } else {
        // ADAPTIVE SURGE ROUTE (North Ring Elevated Viaduct)
        ctx.moveTo(width * 0.12, height * 0.2);
        ctx.lineTo(width * 0.45, height * 0.15);
        ctx.lineTo(width * 0.78, height * 0.18);
        ctx.lineTo(width * 0.85, height * 0.35);
        ctx.strokeStyle = '#38BDF8';
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('⚡ ADAPTIVE SAFE VIADUCT (HIGH GROUND)', width * 0.35, height * 0.12);
      }

      // User Location Beacon (Pin)
      const userX = width * 0.15;
      const userY = isSurge ? height * 0.2 : height * 0.75;
      ctx.beginPath();
      ctx.arc(userX, userY, 10 + Math.sin(time * 4) * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(userX, userY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('📍 YOU ARE HERE', userX - 25, userY - 14);

      // Nearby Facilities on Flood Map
      const fac = DISASTER_DATA.facilities;

      // Flood Shelters
      const s1X = width * fac.floodShelters[0].mapX;
      const s1Y = height * fac.floodShelters[0].mapY;
      this.drawFacilityPin(ctx, s1X, s1Y, '🏛️', 'St. Xavier Arena', isSurge ? 'Road Cut Off' : 'Primary Shelter', isSurge ? '#64748B' : '#10B981', !isSurge, time);

      const s2X = width * fac.floodShelters[1].mapX;
      const s2Y = height * fac.floodShelters[1].mapY;
      this.drawFacilityPin(ctx, s2X, s2Y, '🏛️', 'North Civic Relief', isSurge ? '⚡ ADAPTIVE RELIEF' : 'Reserve Ridge (28m)', isSurge ? '#38BDF8' : '#34D399', isSurge, time);

      // Nearby Police Roadblock Post
      const pX = width * fac.policeStations[0].mapX;
      const pY = height * fac.policeStations[0].mapY;
      this.drawFacilityPin(ctx, pX, pY, '🚓', 'Traffic Division 1', 'Flood Diversion', '#60A5FA', false, time);

      // Map legend overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 220, 62, 6);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('DYNAMIC FLOOD RISK SECTOR MAP', 18, 26);
      ctx.fillStyle = isSurge ? '#EF4444' : '#06B6D4';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(isSurge ? '● CRITICAL EXPANDED BREACH' : '● 15-MIN PREDICTION ZONE', 18, 42);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(isSurge ? 'Autonomous Reroute: Active' : 'Safe Route: GT High Ground', 18, 58);

      if (this.animationFrames[canvasId]) {
        this.animationFrames[canvasId] = requestAnimationFrame(animate);
      }
    };

    if (this.animationFrames[canvasId]) cancelAnimationFrame(this.animationFrames[canvasId]);
    this.animationFrames[canvasId] = requestAnimationFrame(animate);
  }

  // =========================================================================
  // 3. FIRE ACCIDENT & DISPERSION PLUME MAP
  // =========================================================================
  renderFireMap(canvasId, windDirection = 'NE', windAngle = 45, windSpeed = 26) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const setup = this.setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    let time = 0;
    const animate = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Dark Industrial Grid Background
      ctx.fillStyle = '#080C16';
      ctx.fillRect(0, 0, width, height);

      // Facility grid
      ctx.strokeStyle = '#182030';
      ctx.lineWidth = 1;
      const step = 35;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Fire Origin (Central Industrial Storage)
      const fireX = width * 0.45;
      const fireY = height * 0.55;

      // Toxic Plume Dispersion Cone (Rotates based on wind angle)
      const angleRad = (windAngle * Math.PI) / 180;
      const plumeLength = 220;
      const spreadAngle = 0.35;

      ctx.save();
      ctx.translate(fireX, fireY);

      // Draw Plume gradient
      const plumeGrad = ctx.createRadialGradient(0, 0, 15, Math.cos(angleRad) * plumeLength, Math.sin(angleRad) * plumeLength, 150);
      plumeGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
      plumeGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.4)');
      plumeGrad.addColorStop(1, 'rgba(100, 116, 139, 0.02)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, plumeLength + Math.sin(time * 3) * 10, angleRad - spreadAngle, angleRad + spreadAngle);
      ctx.closePath();
      ctx.fillStyle = plumeGrad;
      ctx.fill();

      // Plume boundary stroke
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // Animated Smoke Particles inside Plume
      ctx.save();
      for (let i = 0; i < 18; i++) {
        const particlePhase = (time * 1.5 + i * 0.3) % 1;
        const dist = particlePhase * (plumeLength - 10);
        const spreadOffset = (Math.sin(i * 99 + time) * 0.28) * dist;
        const px = fireX + Math.cos(angleRad) * dist - Math.sin(angleRad) * spreadOffset;
        const py = fireY + Math.sin(angleRad) * dist + Math.cos(angleRad) * spreadOffset;
        const radius = 3 + particlePhase * 12;

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${0.45 * (1 - particlePhase)})`;
        ctx.fill();
      }
      ctx.restore();

      // Fire Core Flame (Pulsing)
      ctx.beginPath();
      ctx.arc(fireX, fireY, 18 + Math.sin(time * 6) * 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(fireX, fireY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#F97316';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '14px Apple Color Emoji, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔥', fireX, fireY);

      // Nearby Fire & Police Response Units
      const fac = DISASTER_DATA.facilities;
      const f1X = width * fac.fireStations[1].mapX;
      const f1Y = height * fac.fireStations[1].mapY;
      this.drawFacilityPin(ctx, f1X, f1Y, '🚒', 'Hazmat Brigade #4', 'CBRN Foam Tender', '#F97316', true, time);

      const pX = width * fac.policeStations[2].mapX;
      const pY = height * fac.policeStations[2].mapY;
      this.drawFacilityPin(ctx, pX, pY, '🚓', 'Sector 4 Precinct', 'Evac Perimeter', '#60A5FA', false, time);

      const hX = width * fac.hospitals[0].mapX;
      const hY = height * fac.hospitals[0].mapY;
      this.drawFacilityPin(ctx, hX, hY, '🏥', 'Apollo Burn Unit', 'Emergency Ready', '#10B981', false, time);

      // Dynamic Safe Evacuation Corridor (UPWIND / CROSSWIND ONLY)
      ctx.save();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#10B981';

      if (windDirection === 'NE') {
        // Evacuate towards South-West (away from NE plume)
        ctx.beginPath();
        ctx.moveTo(fireX - 40, fireY + 10);
        ctx.lineTo(width * 0.18, height * 0.85);
        ctx.lineTo(40, height * 0.88);
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('✔ SAFE UPWIND EVACUATION CORRIDOR (SW)', width * 0.1, height * 0.8);
      } else {
        // Evacuate towards North-East Gate (away from SW plume)
        ctx.beginPath();
        ctx.moveTo(fireX + 30, fireY - 20);
        ctx.lineTo(width * 0.8, height * 0.2);
        ctx.lineTo(width - 30, height * 0.18);
        ctx.stroke();

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('⚡ ADAPTED SAFE CORRIDOR (NE GATE 1)', width * 0.55, height * 0.14);
      }
      ctx.restore();

      // Environmental Compass & Wind Widget in Top Left
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 240, 72, 6);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ATMOSPHERIC DISPERSION MODEL', 18, 25);

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`WIND: ${windDirection} (${windSpeed} km/h) | ANGLE ${windAngle}°`, 18, 43);

      ctx.fillStyle = '#EF4444';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`PLUME VECTOR: ${windDirection} Sector (Hazard Active)`, 18, 61);

      if (this.animationFrames[canvasId]) {
        this.animationFrames[canvasId] = requestAnimationFrame(animate);
      }
    };

    if (this.animationFrames[canvasId]) cancelAnimationFrame(this.animationFrames[canvasId]);
    this.animationFrames[canvasId] = requestAnimationFrame(animate);
  }

  stopAll() {
    Object.keys(this.animationFrames).forEach(id => {
      cancelAnimationFrame(this.animationFrames[id]);
      delete this.animationFrames[id];
    });
  }
}

window.tacticalMaps = new TacticalMapRenderer();
