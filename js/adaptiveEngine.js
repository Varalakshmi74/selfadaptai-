// SELF-ADAPTIVE DISASTER RESPONSE ENGINE
// Core intelligent system that continuously evaluates telemetry and autonomously adapts response strategies

class SelfAdaptiveDisasterEngine {
  constructor() {
    this.logs = [];
    this.listeners = [];

    // Active state indicators
    this.floodState = {
      isSurgeActive: false,
      currentRisk: 'HIGH',
      waterLevel: 4.15,
      rainfallRate: 78.5,
      activeRoute: 'Primary Route (Via GT Expressway)',
      activeShelter: 'St. Xavier Community High Ground Arena'
    };

    this.accidentState = {
      hospitalA_Saturated: false,
      selectedHospital: 'Apollo City Memorial Trauma Center',
      ambulanceEta: '4.5 mins',
      greenCorridorId: 'Corridor A-1'
    };

    this.fireState = {
      scenarioId: 'fire-industrial',
      windDirection: 'NE',
      windAngle: 45,
      windSpeed: 26,
      plumeHazardSector: 'North-East Sector (1.8km Plume)',
      safeEvacuationRoute: 'South-West via Industrial Parkway #8'
    };

    // Initialize with system startup log
    this.addLog('SYSTEM_INIT', 'Self-Adaptive Disaster Response AI Core initialized. Sensors nominal.');
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  addLog(category, message, severity = 'info') {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const entry = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp,
      category,
      message,
      severity
    };
    this.logs.unshift(entry);
    if (this.logs.length > 50) this.logs.pop();
    this.notify();
    return entry;
  }

  // FLOOD SELF-ADAPTIVE RESPONSE
  triggerFloodSurge(simulateSurge = true) {
    this.floodState.isSurgeActive = simulateSurge;

    if (simulateSurge) {
      this.floodState.currentRisk = 'CRITICAL SEVERE';
      this.floodState.waterLevel = 4.85;
      this.floodState.rainfallRate = 115.0;
      this.floodState.activeRoute = 'ADAPTIVE EMERGENCY ROUTE: Via North Ring Elevated Viaduct';
      this.floodState.activeShelter = 'North Civic Disaster Relief Center (High-Ground Facility)';

      if (window.soundSystem) window.soundSystem.playAlert('critical');

      this.addLog('ADAPTIVE_TRIGGER', '⚡ FLASH SURGE DETECTED: Water level breached +4.85m threshold (+115 mm/h cloudburst).', 'critical');
      this.addLog('AUTO_REROUTE', '🚨 Primary evacuation route submerged. AI autonomously switched safe path to North Ring Elevated Viaduct.', 'warning');
      this.addLog('SHELTER_FAILOVER', '🏛️ St. Xavier shelter road compromised. Rerouting all citizens to North Civic Relief Center.', 'warning');
      this.addLog('MULTI_AGENCY_DISPATCH', '📡 Autonomous priority alert dispatched to NDRF Water Rescue & State Police.', 'info');
    } else {
      this.floodState.currentRisk = 'HIGH';
      this.floodState.waterLevel = 4.15;
      this.floodState.rainfallRate = 78.5;
      this.floodState.activeRoute = 'Primary Route (Via GT Expressway)';
      this.floodState.activeShelter = 'St. Xavier Community High Ground Arena';

      this.addLog('STATE_RESET', 'Flood telemetry returned to baseline High Monitoring state.', 'info');
    }

    this.notify();
    return this.floodState;
  }

  // ROAD ACCIDENT SELF-ADAPTIVE RESPONSE
  triggerHospitalSaturation(simulateSaturation = true) {
    this.accidentState.hospitalA_Saturated = simulateSaturation;

    if (simulateSaturation) {
      this.accidentState.selectedHospital = 'St. Jude Apex Multispeciality Hospital';
      this.accidentState.ambulanceEta = '6.8 mins (Green Corridor Synchronized)';
      this.accidentState.greenCorridorId = 'Green Corridor B-2 (North Bypass)';

      if (window.soundSystem) window.soundSystem.playAlert('adaptive');

      this.addLog('CAPACITY_OVERFLOW', '⚠️ Apollo City Memorial reported 0 ICU beds & emergency surgical bay saturation.', 'critical');
      this.addLog('AUTO_DIVERT', '🚑 SELF-ADAPTIVE REROUTE: Ambulance telemetry diverted to St. Jude Apex Multispeciality Hospital.', 'warning');
      this.addLog('TRAFFIC_OVERRIDE', '🚦 Traffic Signal System updated: Green Corridor B-2 engaged for ambulance dispatch.', 'info');
      this.addLog('HOSPITAL_ALERT', '🏥 Trauma Bay 2 & On-call neurosurgery team notified at St. Jude Apex Hospital.', 'info');
    } else {
      this.accidentState.selectedHospital = 'Apollo City Memorial Trauma Center';
      this.accidentState.ambulanceEta = '4.5 mins';
      this.accidentState.greenCorridorId = 'Corridor A-1';

      this.addLog('STATE_RESET', 'Hospital routing restored to primary Apollo City Memorial.', 'info');
    }

    this.notify();
    return this.accidentState;
  }

  // FIRE ACCIDENT SELF-ADAPTIVE RESPONSE
  triggerWindShift(targetDirection = 'SW', targetAngle = 225, targetSpeed = 38) {
    const prevDirection = this.fireState.windDirection;
    this.fireState.windDirection = targetDirection;
    this.fireState.windAngle = targetAngle;
    this.fireState.windSpeed = targetSpeed;

    if (targetDirection === 'SW') {
      this.fireState.plumeHazardSector = 'South-West Sector (2.6km High Hazard Cone)';
      this.fireState.safeEvacuationRoute = 'EMERGENCY ADAPTIVE ROUTE: North-East Perimeter Expressway via Gate 1';

      if (window.soundSystem) window.soundSystem.playAlert('warning');

      this.addLog('METEOROLOGY_SHIFT', `🌪️ WIND SHIFT DETECTED: Shifted from ${prevDirection} to ${targetDirection} at ${targetSpeed} km/h.`, 'warning');
      this.addLog('PLUME_RECALCULATED', '☣️ Toxic dispersion plume trajectory shifted to South-West residential perimeter.', 'critical');
      this.addLog('EVACUATION_ADAPTED', '🏃 Previous evacuation corridor compromised by toxic smoke. Autonomous switch to North-East Expressway Gate 1.', 'warning');
      this.addLog('CIVIL_DEFENSE_ALERT', '📢 Automated SMS & siren broadcast issued for South-West Sector evacuation.', 'info');
    } else {
      this.fireState.plumeHazardSector = 'North-East Sector (1.8km Plume)';
      this.fireState.safeEvacuationRoute = 'MANDATORY UPWIND / CROSSWIND CORRIDOR: South-West via Industrial Parkway #8';

      this.addLog('METEOROLOGY_SHIFT', `Wind telemetry adjusted to ${targetDirection} (${targetSpeed} km/h). Evacuation routes synced.`, 'info');
    }

    this.notify();
    return this.fireState;
  }
}

window.adaptiveEngine = new SelfAdaptiveDisasterEngine();
