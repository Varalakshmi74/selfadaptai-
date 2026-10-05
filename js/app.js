// ==========================================================================
// SELFADAPT AI – Main Application Controller & Event Orchestrator
// ==========================================================================

class DisasterApp {
  constructor() {
    this.state = {
      isAuthenticated: false,
      userRole: 'Incident Command Officer',
      userName: 'Officer Varalakshmi',
      userAvatar: 'VL',
      currentLocation: {
        lat: 13.0827,
        lng: 80.2707,
        label: 'Zone Alpha - Riverside Delta Sector',
        status: 'default' // 'default' | 'enabled' | 'denied'
      },
      activePage: 'page-login',
      activeFloodTab: 'tab-flood-prediction',
      selectedAccidentPresetIdx: 0,
      selectedFireScenarioId: 'fire-industrial',
      selectedRescueType: 'NDRF Inflatable Rescue Boat',
      activeMapLayerFilter: 'all',
      isMuted: false
    };

    this.floodChart = null;
  }

  init() {
    this.bindEvents();
    this.initAdaptiveLogListener();
    this.renderLogStream();
    console.log('SELFADAPT AI Disaster Management System Initialized.');
  }

  // EVENT BINDINGS
  bindEvents() {
    // Brand Click -> Dashboard (if logged in)
    document.getElementById('navBrandBtn').addEventListener('click', () => {
      if (this.state.isAuthenticated) this.navigateTo('page-dashboard');
    });

    document.getElementById('btnDashboardNav').addEventListener('click', () => {
      this.navigateTo('page-dashboard');
    });

    // Login Events
    document.getElementById('btnSubmitLogin').addEventListener('click', () => this.handleLogin());
    document.getElementById('btnQuickDemoLogin').addEventListener('click', () => this.fillDemoCredentials());
    document.getElementById('btnRequestLocation').addEventListener('click', () => this.requestBrowserGeolocation());
    document.getElementById('selectDemoLocation').addEventListener('change', (e) => this.handlePresetLocationChange(e));

    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => this.handleLogout());

    // Sound Toggle
    document.getElementById('btnToggleSound').addEventListener('click', () => this.toggleSound());

    // Self-Adaptive Triggers
    document.getElementById('btnTriggerFloodSurge').addEventListener('click', () => this.toggleFloodSurge());
    document.getElementById('btnTriggerHospitalSaturation').addEventListener('click', () => this.toggleHospitalSaturation());
    document.getElementById('btnTriggerWindShift').addEventListener('click', () => this.toggleWindShift());
  }

  // --------------------------------------------------------------------------
  // NAVIGATION & PAGE ROUTING
  // --------------------------------------------------------------------------
  navigateTo(pageId) {
    if (!this.state.isAuthenticated && pageId !== 'page-login') {
      this.showToast('Please sign in to access emergency terminal.', 'warning');
      pageId = 'page-login';
    }

    // Hide all pages
    document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));

    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      this.state.activePage = pageId;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Page-specific initializers
      if (pageId === 'page-flood') {
        this.initFloodPage();
      } else if (pageId === 'page-accident') {
        this.initAccidentPage();
      } else if (pageId === 'page-fire') {
        this.initFirePage();
      }

      if (window.soundSystem) window.soundSystem.playAlert('beep');
    }
  }

  // --------------------------------------------------------------------------
  // PAGE 1: LOGIN & GEOLOCATION (Any ID / Password Accepted)
  // --------------------------------------------------------------------------
  fillDemoCredentials() {
    document.getElementById('loginEmail').value = 'varalakshmi';
    document.getElementById('loginPassword').value = 'murugan';
    this.showToast('Default Credentials Loaded (varalakshmi / murugan)', 'success');
  }

  requestBrowserGeolocation() {
    const badge = document.getElementById('loginLocationBadge');
    const display = document.getElementById('loginCoordsDisplay');

    if (!navigator.geolocation) {
      badge.className = 'badge-location-status denied';
      badge.innerHTML = '⚠️ Browser GPS Unavailable';
      display.textContent = 'Geolocation API not supported by this browser. Using fallback zone.';
      return;
    }

    badge.className = 'badge-location-status pending';
    badge.innerHTML = '<span class="beacon"></span> Querying Satellites...';
    display.textContent = 'Contacting browser GPS hardware...';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        const accuracy = Math.round(pos.coords.accuracy || 15);

        this.state.currentLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: `Live GPS: ${lat}° N, ${lng}° E (±${accuracy}m)`,
          status: 'enabled'
        };

        badge.className = 'badge-location-status enabled';
        badge.innerHTML = '✔ Location Enabled';
        display.innerHTML = `<strong>Acquired Live Coordinates:</strong> Lat ${lat}°, Long ${lng}° (Accuracy: ±${accuracy}m)`;

        this.updateNavLocationTelemetry();
        this.showToast('GPS Location Verified & Locked', 'success');
        if (window.soundSystem) window.soundSystem.playAlert('success');

        window.adaptiveEngine.addLog('GPS_LOCK', `Live responder coordinates acquired: ${lat}° N, ${lng}° E`, 'info');
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err.message);
        badge.className = 'badge-location-status denied';
        badge.innerHTML = '⚠️ Permission Denied';
        display.innerHTML = `<span style="color:#F87171;">Location permission denied or unavailable. Fallback Incident Zone loaded.</span>`;
        this.state.currentLocation.status = 'denied';
        this.showToast('Location Access Denied. Fallback Zone active.', 'warning');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }

  handlePresetLocationChange(e) {
    const idx = parseInt(e.target.value, 10);
    const loc = DISASTER_DATA.locations[idx];
    if (loc) {
      this.state.currentLocation = {
        lat: loc.lat,
        lng: loc.lng,
        label: loc.name,
        status: 'preset'
      };

      const badge = document.getElementById('loginLocationBadge');
      badge.className = 'badge-location-status enabled';
      badge.innerHTML = '✔ Zone Set';
      document.getElementById('loginCoordsDisplay').textContent = `${loc.name} (Lat: ${loc.lat}°, Lng: ${loc.lng}°)`;
      this.updateNavLocationTelemetry();
      this.showToast(`Active Incident Sector set to: ${loc.name}`, 'info');
    }
  }

  updateNavLocationTelemetry() {
    const navText = document.getElementById('navLocationText');
    if (navText) {
      navText.textContent = `GPS: ${this.state.currentLocation.lat.toFixed(4)}° N, ${this.state.currentLocation.lng.toFixed(4)}° E`;
    }
  }

  handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();

    if (!email || !pass) {
      this.showToast('Please enter your Login ID and Password.', 'warning');
      return;
    }

    // Set User Name & Avatar based on input
    let displayName = 'Officer Varalakshmi';
    let avatarInitials = 'VL';

    if (email.toLowerCase() === 'varalakshmi') {
      displayName = 'Officer Varalakshmi';
      avatarInitials = 'VL';
    } else {
      // Capitalize user input
      const parts = email.split('@')[0].replace(/[._-]/g, ' ').split(' ');
      displayName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      avatarInitials = parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('') || 'DR';
    }

    this.state.userName = displayName;
    this.state.userAvatar = avatarInitials;
    this.state.isAuthenticated = true;

    // Update Profile Pill in Navigation
    const nameEl = document.getElementById('userDisplayName');
    const avatarEl = document.getElementById('userAvatarPill');
    if (nameEl) nameEl.textContent = displayName;
    if (avatarEl) avatarEl.textContent = avatarInitials;

    // Show top navigation controls
    document.getElementById('navTelemetryGroup').style.display = 'flex';
    document.getElementById('navActionsGroup').style.display = 'flex';
    this.updateNavLocationTelemetry();

    this.showToast(`Welcome ${displayName}. Incident Command Terminal Online.`, 'success');
    if (window.soundSystem) window.soundSystem.playAlert('success');

    window.adaptiveEngine.addLog('USER_AUTH', `Authenticated user [${displayName}] into Disaster Response Command.`, 'info');

    // Go to Dashboard
    this.navigateTo('page-dashboard');
  }

  handleLogout() {
    this.state.isAuthenticated = false;
    document.getElementById('navTelemetryGroup').style.display = 'none';
    document.getElementById('navActionsGroup').style.display = 'none';
    this.showToast('Logged out of Incident Terminal.', 'info');
    this.navigateTo('page-login');
  }

  toggleSound() {
    const isMuted = window.soundSystem.toggleMute();
    this.state.isMuted = isMuted;
    const label = document.getElementById('soundStatusText');
    if (isMuted) {
      label.textContent = 'Sound Off';
      this.showToast('Emergency audio alert broadcast muted.', 'info');
    } else {
      label.textContent = 'Sound On';
      window.soundSystem.playAlert('beep');
      this.showToast('Emergency audio alert broadcast active.', 'info');
    }
  }

  // --------------------------------------------------------------------------
  // PAGE 3: FLOOD MANAGEMENT
  // --------------------------------------------------------------------------
  switchTab(category, tabId, btnElement) {
    const parent = btnElement.closest('.page-view') || document;
    parent.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.tab-pane-content').forEach(p => p.classList.remove('active'));

    btnElement.classList.add('active');
    const targetPane = document.getElementById(tabId);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    if (tabId === 'tab-flood-zone') {
      setTimeout(() => {
        window.tacticalMaps.renderFloodMap('floodTacticalCanvas', window.adaptiveEngine.floodState.isSurgeActive);
      }, 50);
    }
  }

  initFloodPage() {
    this.renderFloodTelemetryChart();
    setTimeout(() => {
      window.tacticalMaps.renderFloodMap('floodTacticalCanvas', window.adaptiveEngine.floodState.isSurgeActive);
    }, 100);
  }

  renderFloodTelemetryChart() {
    const canvas = document.getElementById('floodTelemetryChart');
    if (!canvas) return;

    if (this.floodChart) {
      this.floodChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const labels = ['06:00', '07:00', '08:00', '09:00', '10:00', '10:45 (Now)'];
    const rainfallData = [18, 26, 45, 62, 74, 78.5];
    const waterLevelData = [1.8, 2.1, 2.9, 3.4, 3.8, 4.15];

    this.floodChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Rainfall (mm/h)',
            data: rainfallData,
            borderColor: '#38BDF8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            tension: 0.35,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'River Gauge (meters)',
            data: waterLevelData,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.35,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: '#94A3B8', font: { family: 'Inter', size: 10 } }
          }
        },
        scales: {
          x: {
            ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 9 } },
            grid: { color: '#1E293B' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Rainfall (mm/h)', color: '#38BDF8', font: { size: 9 } },
            ticks: { color: '#38BDF8', font: { size: 9 } },
            grid: { color: '#1E293B' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Water Level (m)', color: '#EF4444', font: { size: 9 } },
            ticks: { color: '#EF4444', font: { size: 9 } },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  toggleFloodSurge() {
    const isCurrentlySurge = window.adaptiveEngine.floodState.isSurgeActive;
    const newState = !isCurrentlySurge;
    const floodData = window.adaptiveEngine.triggerFloodSurge(newState);

    const btn = document.getElementById('btnTriggerFloodSurge');
    const label = document.getElementById('floodSurgeBtnLabel');
    const riskTag = document.getElementById('floodRiskStatusTag');
    const scoreDisp = document.getElementById('floodScoreDisplay');
    const scoreFill = document.getElementById('floodScoreFill');
    const rainTele = document.getElementById('floodRainTelemetry');
    const waterTele = document.getElementById('floodWaterTelemetry');
    const routeTitle = document.getElementById('floodRouteTitle');
    const routeDesc = document.getElementById('floodRouteDesc');
    const routeStatus = document.getElementById('floodRouteStatus');
    const zoneWarning = document.getElementById('floodZoneWarningText');

    if (newState) {
      btn.classList.add('active');
      label.textContent = 'Revert Flood Surge to Baseline High';
      riskTag.className = 'risk-level-tag severe';
      riskTag.textContent = 'CRITICAL SEVERE (SURGE BREACH)';
      scoreDisp.className = 'risk-level-tag severe';
      scoreDisp.textContent = '98 / 100';
      scoreFill.style.width = '98%';
      rainTele.innerHTML = '115.0 <small>mm/h</small>';
      waterTele.innerHTML = '4.85 <small>meters</small>';

      zoneWarning.textContent = '⚠️ ACTIVE INUNDATION BREACH (850m RADIUS)';
      zoneWarning.style.color = '#EF4444';

      routeTitle.textContent = 'ADAPTIVE EMERGENCY ROUTE (AUTONOMOUS FAILOVER)';
      routeTitle.style.color = '#38BDF8';
      routeDesc.textContent = 'Primary Sector 4 Ridge is submerged. AI switched safe transit to North Ring Elevated Viaduct (+28m MSL).';
      routeStatus.className = 'road-badge blocked';
      routeStatus.textContent = 'AUTONOMOUS FAILOVER ENGAGED';

      // Update Roads Table
      document.getElementById('floodRoadsTableBody').innerHTML = `
        <tr><td>Riverbank Blvd</td><td>1.60m</td><td>SUBMERGED</td><td><span class="road-badge blocked">BREACHED</span></td></tr>
        <tr><td>Canal Flyover Ramp</td><td>0.90m</td><td>SUBMERGED</td><td><span class="road-badge blocked">CLOSED</span></td></tr>
        <tr><td>Sector 4 Ridge</td><td>0.45m</td><td>WATER ACCUMULATION</td><td><span class="road-badge warning">COMPROMISED</span></td></tr>
        <tr><td>North Ring Elevated Viaduct</td><td>0.00m</td><td>ALL VEHICLES</td><td><span class="road-badge safe">SAFE VIADUCT</span></td></tr>
      `;

      // Update Shelter Cards
      document.getElementById('shelterCard-1').className = 'shelter-card';
      document.getElementById('shelterCard-1').querySelector('div div:last-child').innerHTML = '<span style="color:#F87171;">⚠️ Access Road Submerged - Capacity Saturated</span>';

      document.getElementById('shelterCard-2').className = 'shelter-card adaptive-shelter';
      document.getElementById('shelterCard-2').querySelector('div div:last-child').innerHTML = '<span style="color:#38BDF8; font-weight:700;">⚡ AUTONOMOUS PRIMARY RELIEF DESTINATION</span>';

      this.showToast('⚡ SELF-ADAPTIVE RESPONSE: Flood breach detected. Safe route & shelters autonomously recalculated!', 'critical');
    } else {
      btn.classList.remove('active');
      label.textContent = 'Simulate Flash Surge (+40cm Inundation)';
      riskTag.className = 'risk-level-tag high';
      riskTag.textContent = 'HIGH RISK';
      scoreDisp.className = 'risk-level-tag high';
      scoreDisp.textContent = '84 / 100';
      scoreFill.style.width = '84%';
      rainTele.innerHTML = '78.5 <small>mm/h</small>';
      waterTele.innerHTML = '4.15 <small>meters</small>';

      zoneWarning.textContent = 'Expansion in 15 mins';
      zoneWarning.style.color = '#38BDF8';

      routeTitle.textContent = 'Primary Recommended Safe Route';
      routeTitle.style.color = '#34D399';
      routeDesc.textContent = 'Via Sector 4 Ridge & GT Expressway (Distance: 3.8 km | ETA: 9 mins | Elevation: +16m MSL).';
      routeStatus.className = 'road-badge safe';
      routeStatus.textContent = 'OPTIMAL ELEVATION';

      // Reset Roads Table
      document.getElementById('floodRoadsTableBody').innerHTML = `
        <tr><td>Riverbank Blvd</td><td>0.85m</td><td>BLOCKED</td><td><span class="road-badge blocked">CRITICAL</span></td></tr>
        <tr><td>Canal Flyover Ramp</td><td>0.35m</td><td>HEAVY ONLY</td><td><span class="road-badge warning">WARNING</span></td></tr>
        <tr><td>GT Expressway</td><td>0.00m</td><td>ALL VEHICLES</td><td><span class="road-badge safe">SAFE</span></td></tr>
        <tr><td>Sector 4 Ridge</td><td>0.00m</td><td>ALL VEHICLES</td><td><span class="road-badge safe">SAFE</span></td></tr>
      `;

      document.getElementById('shelterCard-1').className = 'shelter-card active-shelter';
      document.getElementById('shelterCard-1').querySelector('div div:last-child').innerHTML = '<span style="color:#34D399; font-weight:600;">Capacity: 480 / 600 Occupied (80%)</span>';
      document.getElementById('shelterCard-2').className = 'shelter-card';

      this.showToast('Flood system restored to Baseline High Monitoring.', 'info');
    }

    // Re-render tactical map
    window.tacticalMaps.renderFloodMap('floodTacticalCanvas', newState);
  }

  selectShelter(shelterName) {
    this.showModal(
      'Shelter Navigation Route Generated',
      'Turn-by-turn flood safe directions engaged',
      `GPS navigation route generated to <strong>${shelterName}</strong> avoiding all known submerged lowlands and tidal spillways. Emergency check-in token reserved.`
    );
    window.adaptiveEngine.addLog('SHELTER_ROUTE', `Citizen evacuation routing locked to ${shelterName}.`, 'info');
  }

  selectRescueOpt(rescueType) {
    this.state.selectedRescueType = rescueType;
    document.querySelectorAll('.rescue-opt-btn').forEach(btn => btn.classList.remove('selected'));
    if (rescueType.includes('Boat')) document.getElementById('optRescueBoat').classList.add('selected');
    else if (rescueType.includes('Ambulance')) document.getElementById('optRescueAmb').classList.add('selected');
    else if (rescueType.includes('Police')) document.getElementById('optRescuePolice').classList.add('selected');
  }

  dispatchFloodRescue() {
    const notes = document.getElementById('floodRescueNotes').value;
    const rescueType = this.state.selectedRescueType;
    const coords = `${this.state.currentLocation.lat.toFixed(4)}° N, ${this.state.currentLocation.lng.toFixed(4)}° E`;

    if (window.soundSystem) window.soundSystem.playAlert('critical');

    this.showModal(
      'Rescue Unit Mobilized',
      'NDRF Disaster Response Coordination',
      `<strong>Unit:</strong> ${rescueType}<br>
       <strong>Target Coordinates:</strong> ${coords}<br>
       <strong>Incident Notes:</strong> ${notes}<br>
       <strong>Status:</strong> Dispatched. Tactical response unit ETA is 8 minutes.`
    );

    window.adaptiveEngine.addLog('RESCUE_DISPATCH', `Dispatched ${rescueType} to GPS (${coords}). Notes: "${notes}"`, 'critical');
    this.showToast(`Emergency Rescue Dispatched: ${rescueType}`, 'critical');
  }

  // --------------------------------------------------------------------------
  // PAGE 4: ROAD ACCIDENT WORKFLOW & MAP FILTERS
  // --------------------------------------------------------------------------
  initAccidentPage() {
    this.setAccidentStep(2);
    setTimeout(() => {
      window.tacticalMaps.renderAccidentMap('accidentTacticalCanvas', window.adaptiveEngine.accidentState.hospitalA_Saturated, this.state.activeMapLayerFilter);
    }, 100);
  }

  setMapLayerFilter(layer, btnElement) {
    this.state.activeMapLayerFilter = layer;

    // Toggle button active styling
    const parent = btnElement.parentElement;
    parent.querySelectorAll('.nav-btn').forEach(b => {
      b.className = 'nav-btn';
    });
    btnElement.className = 'nav-btn btn-primary';

    window.tacticalMaps.renderAccidentMap('accidentTacticalCanvas', window.adaptiveEngine.accidentState.hospitalA_Saturated, layer);
    this.showToast(`Map layer filter set to: ${layer.toUpperCase()}`, 'info');
  }

  setAccidentStep(stepNum) {
    const stepNodes = document.querySelectorAll('.stepper-pipeline-bar .step-node');
    stepNodes.forEach((node, idx) => {
      node.classList.remove('active');
      if (idx + 1 < stepNum) node.classList.add('completed');
      else if (idx + 1 === stepNum) node.classList.add('active');
      else node.classList.remove('completed');
    });
  }

  selectPresetCrash(presetIdx) {
    this.state.selectedAccidentPresetIdx = presetIdx;
    document.querySelectorAll('.thumb-preset-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`thumbPreset${presetIdx + 1}`);
    if (activeBtn) activeBtn.classList.add('active');

    const photoData = DISASTER_DATA.accident.demoPhotos[presetIdx];
    if (photoData) {
      document.getElementById('previewCrashImg').src = photoData.url;
      this.reanalyzeCrashImage(photoData.analysis);
    }
  }

  handleAccidentPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewCrashImg').src = e.target.result;
      this.showToast('Custom crash image loaded. Initiating AI Vision Analysis...', 'info');

      // Custom dynamic AI analysis for uploaded photo
      const customAnalysis = {
        severity: 'EVALUATED (Level 3/5)',
        severityClass: 'critical',
        score: 74,
        vehiclesInvolved: 2,
        vehicleTypes: 'Multiple Passenger Vehicles',
        airbagDeployed: 'YES (Detected via Interior Scanning)',
        structuralDeformation: 'Moderate Frontal Crush & Windshield Impact',
        hazards: ['Debris on Lane', 'Potential Fluid Leak'],
        dispatchRecommendation: 'ALS Ambulance + Traffic Containment Unit',
        estimatedVictims: '1 to 2 injured occupants'
      };

      this.reanalyzeCrashImage(customAnalysis);
    };
    reader.readAsDataURL(file);
  }

  reanalyzeCrashImage(customData = null) {
    const overlay = document.getElementById('aiScanOverlay');
    overlay.classList.add('scanning');

    if (window.soundSystem) window.soundSystem.playAlert('warning');
    this.showToast('AI Neural Vision Scanner processing image...', 'info');

    setTimeout(() => {
      overlay.classList.remove('scanning');

      const data = customData || DISASTER_DATA.accident.demoPhotos[this.state.selectedAccidentPresetIdx].analysis;

      const badge = document.getElementById('crashSeverityBadge');
      badge.className = `severity-score-badge ${data.severityClass}`;
      document.getElementById('crashSeverityText').textContent = data.severity;
      document.getElementById('crashVehiclesVal').textContent = `${data.vehiclesInvolved} Vehicles (${data.vehicleTypes})`;
      document.getElementById('crashAirbagVal').textContent = data.airbagDeployed;
      document.getElementById('crashDeformationVal').textContent = data.structuralDeformation;
      document.getElementById('crashCasualtiesVal').textContent = data.estimatedVictims;
      document.getElementById('crashHazardsVal').textContent = data.hazards.join(', ');
      document.getElementById('crashDispatchVal').textContent = data.dispatchRecommendation;

      if (window.soundSystem) window.soundSystem.playAlert('success');
      this.showToast(`AI Vision Analysis Complete: ${data.severity}`, 'success');

      window.adaptiveEngine.addLog('CV_ANALYSIS', `Crash photo analyzed: Severity=${data.severity}, Airbags=${data.airbagDeployed}`, 'info');
    }, 1200);
  }

  toggleHospitalSaturation() {
    const isCurrentlySaturated = window.adaptiveEngine.accidentState.hospitalA_Saturated;
    const newState = !isCurrentlySaturated;
    const accState = window.adaptiveEngine.triggerHospitalSaturation(newState);

    const btn = document.getElementById('btnTriggerHospitalSaturation');
    const label = document.getElementById('hospitalDivertBtnLabel');
    const hosp1Icu = document.getElementById('hosp1Icu');

    if (newState) {
      btn.classList.add('active');
      label.textContent = 'Revert Hospital A to Available';
      if (hosp1Icu) hosp1Icu.innerHTML = '<span style="color:#EF4444;">0 Beds (FULL / DIVERTED)</span>';

      this.showToast('⚡ SELF-ADAPTIVE FAILOVER: Hospital A saturated. Ambulance autonomously rerouted to St. Jude Apex!', 'warning');
    } else {
      btn.classList.remove('active');
      label.textContent = 'Simulate Hospital A ICU Saturation (Full / Divert)';
      if (hosp1Icu) hosp1Icu.innerHTML = '3 ICU Beds Free (Optimal)';

      this.showToast('Hospital allocation restored to primary Apollo Memorial.', 'info');
    }

    // Update Tactical Map with current layer filter
    window.tacticalMaps.renderAccidentMap('accidentTacticalCanvas', newState, this.state.activeMapLayerFilter);
  }

  broadcastAccidentAlert() {
    const isDiverted = window.adaptiveEngine.accidentState.hospitalA_Saturated;
    const targetHosp = isDiverted ? 'St. Jude Apex Multispeciality Hospital' : 'Apollo City Memorial Trauma Center';
    const corridor = isDiverted ? 'Green Corridor B-2' : 'Corridor A-1';

    if (window.soundSystem) window.soundSystem.playAlert('critical');

    this.showModal(
      'Multi-Agency Emergency Broadcast Dispatched',
      'Trauma Life Support, Police & Fire Headquarters Synchronized',
      `<strong>Target Trauma Bay:</strong> ${targetHosp}<br>
       <strong>Green Corridor Signal Lock:</strong> ${corridor}<br>
       <strong>Traffic Police HQ (Div 1):</strong> Signals prioritized on transit arterial.<br>
       <strong>Central Fire & Hydraulic Rescue (Station 1):</strong> En route to crash location.<br>
       <strong>Highway Patrol #12:</strong> Crash perimeter cordon active.`
    );

    window.adaptiveEngine.addLog('AGENCY_BROADCAST', `Priority accident alert broadcasted to ${targetHosp}, Traffic Police & Fire Rescue.`, 'critical');
    this.showToast('Priority Multi-Agency Alert Dispatched', 'critical');
  }

  // --------------------------------------------------------------------------
  // PAGE 5: FIRE ACCIDENT MANAGEMENT
  // --------------------------------------------------------------------------
  initFirePage() {
    this.selectFireScenario(this.state.selectedFireScenarioId);
  }

  selectFireScenario(scenarioId) {
    this.state.selectedFireScenarioId = scenarioId;

    document.querySelectorAll('.scenario-pill-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`scBtn-${scenarioId.replace('fire-', '')}`);
    if (activeBtn) activeBtn.classList.add('active');

    const scenario = DISASTER_DATA.fire.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    document.getElementById('fireScenarioHeading').textContent = `${scenario.name} Protocol`;
    document.getElementById('fireRiskBadge').textContent = scenario.riskLevel;
    document.getElementById('fireSuppressionVal').textContent = scenario.suppressionAgent;
    document.getElementById('firePerimeterVal').textContent = scenario.perimeter;
    document.getElementById('fireEvacRouteText').textContent = scenario.evacuationRoute;

    const compassWidget = document.getElementById('fireCompassWidget');
    if (scenario.windSensitve) {
      compassWidget.style.display = 'flex';
      const fireState = window.adaptiveEngine.fireState;
      document.getElementById('compassNeedle').style.transform = `rotate(${fireState.windAngle}deg)`;
      document.getElementById('compassWindReadout').textContent = `${fireState.windDirection} ${fireState.windAngle}° (${fireState.windSpeed} km/h)`;
      document.getElementById('compassPlumeReadout').textContent = `Plume Length: 1.8 km Downwind`;
      document.getElementById('fireGasVal').textContent = 'SO₂ / VOCs @ 18.4 ppm (Dangerous)';
    } else {
      compassWidget.style.display = 'none';
      document.getElementById('fireGasVal').textContent = 'Dense Carbon Smoke / Heat Radiation';
    }

    setTimeout(() => {
      const fs = window.adaptiveEngine.fireState;
      window.tacticalMaps.renderFireMap('fireTacticalCanvas', fs.windDirection, fs.windAngle, fs.windSpeed);
    }, 50);

    window.adaptiveEngine.addLog('FIRE_SCENARIO', `Fire scenario switched to: ${scenario.name}`, 'info');
  }

  toggleWindShift() {
    const currentDir = window.adaptiveEngine.fireState.windDirection;
    const isSW = currentDir === 'SW';

    const btn = document.getElementById('btnTriggerWindShift');
    const label = document.getElementById('windShiftBtnLabel');
    const evacText = document.getElementById('fireEvacRouteText');
    const compassNeedle = document.getElementById('compassNeedle');
    const compassReadout = document.getElementById('compassWindReadout');
    const compassPlume = document.getElementById('compassPlumeReadout');

    if (!isSW) {
      // Shift to SW
      window.adaptiveEngine.triggerWindShift('SW', 225, 38);
      btn.classList.add('active');
      label.textContent = 'Revert Wind to Baseline (NE 26 km/h)';

      compassNeedle.style.transform = 'rotate(225deg)';
      compassReadout.textContent = 'SW 225° (38 km/h Gale)';
      compassPlume.textContent = 'Plume Shifted: South-West Residential Perimeter';

      evacText.textContent = 'EMERGENCY ADAPTIVE ROUTE: North-East Perimeter Expressway via Gate 1';

      this.showToast('⚡ SELF-ADAPTIVE RESPONSE: Wind shift detected! Safe evacuation corridor dynamically redirected to Gate 1.', 'critical');
    } else {
      // Revert to NE
      window.adaptiveEngine.triggerWindShift('NE', 45, 26);
      btn.classList.remove('active');
      label.textContent = 'Simulate Sudden Wind Shift (NE → SW 38 km/h)';

      compassNeedle.style.transform = 'rotate(45deg)';
      compassReadout.textContent = 'NE 45° (26 km/h)';
      compassPlume.textContent = 'Plume Length: 1.8 km Downwind';

      evacText.textContent = 'MANDATORY UPWIND / CROSSWIND CORRIDOR: South-West via Industrial Parkway #8';

      this.showToast('Wind telemetry restored to baseline NE 26 km/h.', 'info');
    }

    const fs = window.adaptiveEngine.fireState;
    window.tacticalMaps.renderFireMap('fireTacticalCanvas', fs.windDirection, fs.windAngle, fs.windSpeed);
  }

  broadcastFireAlert() {
    const fs = window.adaptiveEngine.fireState;
    const scenario = DISASTER_DATA.fire.scenarios.find(s => s.id === this.state.selectedFireScenarioId);

    if (window.soundSystem) window.soundSystem.playAlert('critical');

    this.showModal(
      'Fire & Hazmat Suppression Mobilized',
      'Civil Defense & Specialized Response Unit',
      `<strong>Scenario:</strong> ${scenario.name}<br>
       <strong>Primary Fire Unit:</strong> ${scenario.facilities.fireStation}<br>
       <strong>Burn Care Hospital:</strong> ${scenario.facilities.hospital}<br>
       <strong>Evacuation Perimeter:</strong> Police Cordon enforced around ${scenario.perimeter}.<br>
       <strong>Safe Evacuation Route:</strong> ${fs.safeEvacuationRoute}`
    );

    window.adaptiveEngine.addLog('FIRE_DISPATCH', `Mobilized ${scenario.facilities.fireStation} & Burn Unit.`, 'critical');
    this.showToast('Fire & Hazmat Units Dispatched', 'critical');
  }

  // --------------------------------------------------------------------------
  // LOG DRAWER & EVENT LISTENER
  // --------------------------------------------------------------------------
  initAdaptiveLogListener() {
    window.adaptiveEngine.subscribe(() => {
      this.renderLogStream();
    });
  }

  renderLogStream() {
    const stream = document.getElementById('adaptiveLogStream');
    if (!stream) return;

    stream.innerHTML = window.adaptiveEngine.logs.map(log => `
      <div class="log-line ${log.severity}">
        <span class="log-time">[${log.timestamp}]</span>
        <span class="log-cat">${log.category}</span>
        <span class="log-msg">${log.message}</span>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // UI UTILITIES: MODAL & TOAST
  // --------------------------------------------------------------------------
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;

    let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    if (type === 'critical') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
</svg>`;
    } else if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div style="font-size: 0.82rem; color: #F8FAFC; font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  showModal(title, subtitle, bodyHtml) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSubtitle').textContent = subtitle;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('commonModal').classList.add('active');
  }

  closeModal() {
    document.getElementById('commonModal').classList.remove('active');
  }
}

// Global App Instance
window.app = new DisasterApp();

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
