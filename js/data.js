// Disaster Management Data Models, Preset Locations & Telemetry Fixtures

const DISASTER_DATA = {
  // Preset locations for quick switching & real geolocation fallbacks
  locations: [
    {
      id: 'loc-delta',
      name: 'Zone Alpha - Riverside Delta Sector (Flood Prone)',
      lat: 13.0827,
      lng: 80.2707,
      zoneType: 'Coastal/Basin Lowland',
      elevation: '4.2m MSL',
      vulnerability: 'High (Flood Risk)'
    },
    {
      id: 'loc-expressway',
      name: 'Zone Beta - Central Expressway Junction (Accident Corridor)',
      lat: 13.0475,
      lng: 80.2089,
      zoneType: 'High-Density Highway',
      elevation: '18.5m MSL',
      vulnerability: 'High (Traffic Density)'
    },
    {
      id: 'loc-industrial',
      name: 'Zone Gamma - Petrochemical & Industrial Corridor',
      lat: 13.1534,
      lng: 80.3012,
      zoneType: 'Industrial Hazardous Complex',
      elevation: '12.0m MSL',
      vulnerability: 'High (Chemical / Fire)'
    }
  ],

  // EMERGENCY FACILITIES MASTER REGISTRY
  facilities: {
    // Hospitals
    hospitals: [
      {
        id: 'hosp-1',
        name: 'Apollo City Memorial Trauma Center',
        type: 'Hospital',
        icon: '🏥',
        distance: '2.1 km',
        eta: '4.5 mins',
        icuBedsAvailable: 3,
        totalIcu: 24,
        traumaLevel: 'Level 1 Comprehensive Trauma',
        otStatus: '2 Trauma OTs Ready',
        greenCorridor: 'Corridor A-1 (Synchronized)',
        status: 'AVAILABLE (Optimal)',
        phone: '+91 44 2829 0200',
        address: 'Greams Road, Sector 3',
        mapX: 0.85, mapY: 0.25
      },
      {
        id: 'hosp-2',
        name: 'St. Jude Apex Multispeciality Hospital',
        type: 'Hospital',
        icon: '🏥',
        distance: '3.8 km',
        eta: '7.2 mins',
        icuBedsAvailable: 8,
        totalIcu: 30,
        traumaLevel: 'Level 1 Trauma & Burn Center',
        otStatus: '3 Trauma OTs Ready',
        greenCorridor: 'Corridor B-2 (Standby)',
        status: 'STANDBY BACKUP',
        phone: '+91 44 2829 0300',
        address: 'Bypass Expressway Junction',
        mapX: 0.85, mapY: 0.80
      },
      {
        id: 'hosp-3',
        name: 'Metro District General Hospital',
        type: 'Hospital',
        icon: '🏥',
        distance: '5.9 km',
        eta: '12 mins',
        icuBedsAvailable: 0,
        totalIcu: 16,
        traumaLevel: 'Level 2 Regional Hospital',
        otStatus: 'All OTs Occupied',
        greenCorridor: 'Not Available',
        status: 'OVERLOADED / DIVERTED',
        phone: '+91 44 2829 0400',
        address: 'South Arterial Ring Road',
        mapX: 0.92, mapY: 0.50
      }
    ],

    // Police Stations
    policeStations: [
      {
        id: 'pol-1',
        name: 'City Traffic Control HQ (Division 1)',
        type: 'Police Station',
        icon: '🚓',
        distance: '1.2 km',
        eta: '3 mins',
        officersOnDuty: 24,
        patrolVehicles: 6,
        specialization: 'Green Corridor Signal Clearance & Traffic Diversion',
        phone: '+91 44 2345 2001',
        address: 'Central Traffic Command Center',
        status: 'ACTIVE PATROL',
        mapX: 0.45, mapY: 0.30
      },
      {
        id: 'pol-2',
        name: 'Highway Patrol Post #12',
        type: 'Police Station',
        icon: '🚓',
        distance: '0.8 km',
        eta: '2 mins',
        officersOnDuty: 8,
        patrolVehicles: 3,
        specialization: 'High-Speed Crash Response & Lane Blockade Cordon',
        phone: '+91 44 2345 2002',
        address: 'Expressway Toll Gate KM 40',
        status: 'ON SCENE INTERCEPTOR',
        mapX: 0.28, mapY: 0.65
      },
      {
        id: 'pol-3',
        name: 'Sector 4 Rapid Containment Precinct',
        type: 'Police Station',
        icon: '🚓',
        distance: '2.6 km',
        eta: '5 mins',
        officersOnDuty: 18,
        patrolVehicles: 4,
        specialization: 'Disaster Crowd Evacuation & Cordon Security',
        phone: '+91 44 2345 2003',
        address: 'Sector 4 Civic Plaza',
        status: 'STANDBY',
        mapX: 0.60, mapY: 0.18
      }
    ],

    // Fire Stations
    fireStations: [
      {
        id: 'fire-st-1',
        name: 'Central Fire & Aerial Rescue HQ (Station 1)',
        type: 'Fire Station',
        icon: '🚒',
        distance: '1.9 km',
        eta: '4 mins',
        vehicles: '54m Bronto Skylift + Water Foam Tender',
        crewReady: 16,
        waterCapacity: '12,000 Liters + High Expansion Foam',
        phone: '+91 44 2854 0101',
        address: 'Station Road, City Center',
        status: 'DISPATCH READY',
        mapX: 0.38, mapY: 0.72
      },
      {
        id: 'fire-st-2',
        name: 'Hazmat Industrial Fire Brigade #4',
        type: 'Fire Station',
        icon: '🚒',
        distance: '2.8 km',
        eta: '5.5 mins',
        vehicles: 'CBRN Chemical Foam Cannon Tender',
        crewReady: 22,
        waterCapacity: '25,000 Liters AFFF Foam + Dry Chemical',
        phone: '+91 44 2854 0104',
        address: 'Petrochemical Access Gate 2',
        status: 'HAZMAT SPECIALIZED',
        mapX: 0.65, mapY: 0.65
      },
      {
        id: 'fire-st-3',
        name: 'Suburban Quick Response Fire Unit #7',
        type: 'Fire Station',
        icon: '🚒',
        distance: '3.5 km',
        eta: '7 mins',
        vehicles: 'Rapid Water Mist Tender + Hydraulic Rescue Tools',
        crewReady: 10,
        waterCapacity: '8,000 Liters',
        phone: '+91 44 2854 0107',
        address: 'East Ring Road Sector 8',
        status: 'STANDBY',
        mapX: 0.15, mapY: 0.40
      }
    ],

    // Flood Shelters
    floodShelters: [
      {
        id: 'sh-1',
        name: 'St. Xavier Community High Ground Arena',
        type: 'Flood Shelter',
        icon: '🏛️',
        distance: '2.1 km',
        capacity: '480 / 600 Occupied (80%)',
        medicalSupport: 'Full Paramedic Unit & Emergency Generators',
        elevation: '19.4m MSL (High Ground)',
        status: 'AVAILABLE (Primary)',
        contact: '+91 44 2839 0101',
        address: 'Hilltop Avenue Sector 2',
        mapX: 0.82, mapY: 0.70
      },
      {
        id: 'sh-2',
        name: 'North Civic Disaster Relief Center',
        type: 'Flood Shelter',
        icon: '🏛️',
        distance: '4.6 km',
        capacity: '120 / 800 Occupied (15% High Capacity)',
        medicalSupport: 'Field Hospital & Helicopter Pad',
        elevation: '28.1m MSL (Maximum Elevation Ridge)',
        status: 'RESERVE HIGH CAPACITY',
        contact: '+91 44 2839 0202',
        address: 'North Ridge Highway KM 14',
        mapX: 0.85, mapY: 0.35
      },
      {
        id: 'sh-3',
        name: 'East Sector Polytechnic Dome',
        type: 'Flood Shelter',
        icon: '🏛️',
        distance: '6.2 km',
        capacity: '50 / 400 Occupied (12%)',
        medicalSupport: 'Basic First Aid & Food Supply Store',
        elevation: '22.0m MSL',
        status: 'STANDBY',
        contact: '+91 44 2839 0303',
        address: 'East Campus Road',
        mapX: 0.50, mapY: 0.85
      }
    ]
  },

  // Flood System Data
  flood: {
    initial: {
      riskLevel: 'HIGH',
      riskScore: 84,
      rainfallRate: 78.5, // mm/hr
      waterLevel: 4.15, // meters
      dangerThreshold: 3.80, // meters
      zoneExpansionTime: '15 mins',
      zoneExpansionRadius: '450m expansion expected',
      reasoning: [
        'Upper catchment rainfall spiked by +145% in past 2 hours (88 mm/h peak).',
        'River discharge rate crossed critical 2,650 cusecs safety limit.',
        'Downstream tidal barrier backflow detected at Coastal Outfall #3.',
        'Soil saturation index reached 94% (Zero drainage absorption capacity).'
      ],
      roads: [
        { id: 'r1', name: 'Riverbank Boulevard (Lower Link)', status: 'FLOODED', depth: '0.85m', passability: 'BLOCKED', risk: 'CRITICAL' },
        { id: 'r2', name: 'Canal Crossing Flyover Ramp', status: 'RISK OF INUNDATION', depth: '0.35m', passability: 'HEAVY VEHICLES ONLY', risk: 'WARNING' },
        { id: 'r3', name: 'Grand Trunk High-Elevation Expressway', status: 'CLEAR & SAFE', depth: '0.00m', passability: 'FULL ALL VEHICLES', risk: 'SAFE' },
        { id: 'r4', name: 'Sector 4 Ridge Arterial', status: 'CLEAR & SAFE', depth: '0.00m', passability: 'FULL ALL VEHICLES', risk: 'SAFE' }
      ],
      safeRoute: {
        id: 'route-primary',
        name: 'Primary Safe Route: Via Sector 4 Ridge & GT Expressway',
        distance: '3.8 km',
        estTime: '9 mins',
        elevationClearance: '+16m High Ground',
        hazardsAvoided: 3,
        status: 'OPTIMAL'
      }
    },
    // Surge state for Self-Adaptive Trigger
    surgeState: {
      riskLevel: 'CRITICAL SEVERE',
      riskScore: 98,
      rainfallRate: 115.0,
      waterLevel: 4.85,
      dangerThreshold: 3.80,
      zoneExpansionTime: 'IMMEDIATE EXPANSION',
      zoneExpansionRadius: '850m expansion breach active',
      reasoning: [
        'SURGE TRIGGER: Unprecedented cloudburst intensity detected (115 mm/h).',
        'Sector 4 Ridge Arterial culvert breached; primary road compromised.',
        'St. Xavier Arena access road submerged; shelter reaching capacity limit.',
        'NDRF Level-3 Water Rescue Boats automatically mobilized.'
      ],
      roads: [
        { id: 'r1', name: 'Riverbank Boulevard', status: 'SUBMERGED (1.6m)', depth: '1.60m', passability: 'NO ACCESS', risk: 'CRITICAL' },
        { id: 'r2', name: 'Canal Crossing Flyover Ramp', status: 'SUBMERGED (0.9m)', depth: '0.90m', passability: 'CLOSED BY POLICE', risk: 'CRITICAL' },
        { id: 'r3', name: 'Sector 4 Ridge Arterial', status: 'WATER ACCUMULATING', depth: '0.45m', passability: 'COMPROMISED / DIVERT', risk: 'WARNING' },
        { id: 'r4', name: 'North Ring High Elevated Viaduct', status: 'SECURE HIGH GROUND', depth: '0.00m', passability: 'CLEAR ELEVATED', risk: 'SAFE' }
      ],
      safeRoute: {
        id: 'route-adaptive',
        name: 'ADAPTIVE EMERGENCY ROUTE: Via North Ring Elevated Viaduct',
        distance: '5.2 km',
        estTime: '12 mins',
        elevationClearance: '+28m Viaduct Deck',
        hazardsAvoided: 5,
        status: 'AUTONOMOUSLY REROUTED'
      }
    }
  },

  // Road Accident System Data
  accident: {
    demoPhotos: [
      {
        id: 'photo-1',
        title: 'Severe Multi-Vehicle Collision',
        url: 'assets/accident_demo1.jpg',
        analysis: {
          severity: 'CRITICAL (Level 4/5)',
          severityClass: 'critical',
          score: 88,
          vehiclesInvolved: 2,
          vehicleTypes: 'Sedan + Compact SUV',
          airbagDeployed: 'YES (Dual Frontal & Side)',
          structuralDeformation: 'Heavy Engine Compartment Intrusion (>40%)',
          hazards: ['Fuel Fluid Leakage on Road', 'Windshield Glass Shatter', 'Trapped Occupant Potential'],
          dispatchRecommendation: 'ALS Trauma Ambulance + Heavy Hydraulic Extrication Tender + Traffic Patrol',
          estimatedVictims: '2 to 3 injured'
        }
      },
      {
        id: 'photo-2',
        title: 'Minor Parking / Low-Speed Bump',
        url: 'assets/accident_demo2.jpg',
        analysis: {
          severity: 'MINOR (Level 1/5)',
          severityClass: 'low',
          score: 22,
          vehiclesInvolved: 2,
          vehicleTypes: 'Hatchback + Sedan',
          airbagDeployed: 'NO',
          structuralDeformation: 'Superficial Bumper Scratch & Dent (<5%)',
          hazards: ['Minor traffic lane obstruction'],
          dispatchRecommendation: 'Local Traffic Patrol for lane clearing + Optional Basic First Aid',
          estimatedVictims: '0 serious injuries'
        }
      },
      {
        id: 'photo-3',
        title: 'Highway Rollover Crash',
        url: 'assets/accident_demo3.jpg',
        analysis: {
          severity: 'MAXIMUM EMERGENCY (Level 5/5)',
          severityClass: 'critical',
          score: 96,
          vehiclesInvolved: 3,
          vehicleTypes: 'Rollover SUV + Support Vehicles',
          airbagDeployed: 'YES (All Curtain & Front)',
          structuralDeformation: 'Catastrophic Roof Crush & Inversion',
          hazards: ['Vehicle Overturned', 'Fuel Spill Fire Risk', 'Multiple lanes blocked'],
          dispatchRecommendation: 'Immediate Dual Trauma ALS Ambulances + Fire Foam Unit + Highway Green Corridor',
          estimatedVictims: '3 to 4 critical'
        }
      }
    ]
  },

  // Fire Accident Scenarios & Environmental Parameters
  fire: {
    scenarios: [
      {
        id: 'fire-gas',
        name: 'Gas Leak / Pipeline Vapor Fire',
        type: 'Hazmat Class 2 (Flammable Gas / LPG)',
        riskLevel: 'VERY HIGH (Class 2 Explosion Hazard)',
        badgeClass: 'danger',
        origin: 'Sector 3 Commercial Distribution Valve Station',
        burnProfile: 'Pressurized gas jet flame, thermal radiation 12 kW/m²',
        suppressionAgent: 'Dry Chemical Powder (DCP) & High Expansion Foam (NO Water Jet directly on valve)',
        perimeter: '350m Exclusion Zone',
        windSensitve: true,
        evacuationRoute: 'Direct Crosswind South Sector via Gate 4',
        facilities: {
          fireStation: 'Hazmat Fire Brigade #4 (CBRN Tender) - 2.8 km (5.5 mins)',
          hospital: 'Apollo City Memorial Trauma Center - 2.1 km (4.5 mins)',
          policeUnit: 'City Traffic Control HQ - Sector 3 Rapid Cordon'
        }
      },
      {
        id: 'fire-house',
        name: 'Residential High-Rise / House Fire',
        type: 'Class A (Solid Combustibles & Interior Furnishings)',
        riskLevel: 'HIGH (Smoke Inhalation Threat)',
        badgeClass: 'danger',
        origin: 'Floor 4 Multi-Family Apartment Unit',
        burnProfile: 'Dense carbon monoxide smoke spread through stairwell shafts',
        suppressionAgent: 'Water Fog Stream + Aerial Ladder Hydraulic Platform',
        perimeter: '100m Street Cordon',
        windSensitve: false,
        nearestHydrant: 'Municipal Hydrant #28 (Operational, 6.2 bar pressure - 35m away)',
        evacuationRoute: 'Fire Escapes Stairs B (Pressurized Smoke-Free Shaft)',
        facilities: {
          fireStation: 'Central Fire HQ (Station 1) - 1.9 km (4 mins)',
          hospital: 'St. Jude Apex Multispeciality - 3.8 km',
          policeUnit: 'Highway Patrol Post #12 Traffic Diversion'
        }
      },
      {
        id: 'fire-shop',
        name: 'Commercial Market / Shopping Complex Fire',
        type: 'Class A / Class B Mixed (Retail & Synthetic Stock)',
        riskLevel: 'HIGH (Crowd Congestion & Flashover Risk)',
        badgeClass: 'danger',
        origin: 'Central Bazaar Ground Floor Electronics Wing',
        burnProfile: 'Fast flame propagation along synthetic inventory and false ceilings',
        suppressionAgent: 'Multi-purpose Foam & Deluge Sprinklers',
        perimeter: '200m Crowd Exclusion Zone',
        windSensitve: false,
        evacuationRoute: 'North Plaza Emergency Exit Concourse & Rear Freight Lane',
        facilities: {
          fireStation: 'Central Fire HQ Station 1 & Station 7 Combined - 1.9 km',
          hospital: 'Apollo City Memorial Trauma Center - 2.1 km',
          policeUnit: 'City Traffic Command Crowd Control Squad'
        }
      },
      {
        id: 'fire-industrial',
        name: 'Chemical Refining & Industrial Storage Fire',
        type: 'Class B / Toxic Chemical (Petrochemical & Sulfur)',
        riskLevel: 'CRITICAL TOXIC HAZMAT (Level 4)',
        badgeClass: 'critical',
        origin: 'Bulk Solvent Storage Tank Farm #T-14',
        burnProfile: 'Hydrocarbon boiling liquid expanding vapor (BLEVE) risk + Toxic plume (SO₂ / VOCs)',
        suppressionAgent: 'Aqueous Film Forming Foam (AFFF) Cannon & Nitrogen Blanketing',
        perimeter: '1,200m Downwind Toxic Plume Hazard Zone',
        windSensitve: true,
        windData: {
          directionAngle: 45, // 45 deg = NE
          directionLabel: 'North-East (NE)',
          speed: '26 km/h',
          plumeSpread: '38° cone',
          plumeLength: '1.8 km downwind',
          toxicPpm: '18.4 ppm (Dangerous to Life threshold > 10 ppm)'
        },
        evacuationRoute: 'MANDATORY UPWIND / CROSSWIND CORRIDOR: South-West via Industrial Parkway #8',
        facilities: {
          fireStation: 'Hazmat Industrial Fire Brigade #4 - 2.8 km (5.5 mins)',
          hospital: 'Apollo City Memorial Trauma & Burn Bay - 2.1 km',
          policeUnit: 'Sector 4 Rapid Containment Precinct Cordon'
        }
      }
    ]
  }
};
