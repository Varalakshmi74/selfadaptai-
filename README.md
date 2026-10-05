# 🛡️ SELFADAPT AI – Intelligent Disaster Response & Emergency Management System

> **Tagline:** *"Predict. Adapt. Respond. Save Lives."*

A modern, professional AI-powered emergency management platform designed for rapid response to **Floods**, **Road Accidents**, and **Fire Emergencies** with real-time **Self-Adaptive Response** logic.

---

## 📁 Local Project Structure (VS Code Ready)

```text
vels/
├── .vscode/
│   ├── launch.json           # VS Code one-click browser launcher
│   └── settings.json         # Workspace & Live Server settings
├── assets/
│   ├── accident_demo1.jpg    # Severe collision demo photo
│   ├── accident_demo2.jpg    # Minor collision demo photo
│   ├── accident_demo3.jpg    # Highway rollover demo photo
│   ├── flood_cover.jpg       # Flood disaster cover
│   └── fire_cover.jpg        # Fire hazmat cover
├── css/
│   └── style.css             # Command-center theme & tactical UI system
├── js/
│   ├── app.js                # Application controller & event dispatcher
│   ├── adaptiveEngine.js     # Self-adaptive disaster response AI engine
│   ├── mapRenderer.js        # 60fps tactical canvas map visualizer
│   ├── data.js               # Emergency database (Hospitals, Police, Fire, Shelters)
│   └── audio.js              # Web Audio API tactical sound alerts
├── index.html                # Master single-page application layout
├── package.json              # NPM scripts (start, dev, open)
└── README.md                 # Project documentation
```

---

## 🚀 How to Run in Visual Studio Code (VSC)

### Method 1: Using VS Code Live Server Extension
1. Open the **`vels`** folder in **Visual Studio Code** (`File` ➡️ `Open Folder...`).
2. Right-click on **`index.html`** in the file explorer.
3. Select **"Open with Live Server"**.

---

### Method 2: Using VS Code Terminal
1. Open the integrated terminal in VS Code (`Ctrl + ~`).
2. Run:
   ```bash
   npm start
   ```
3. Open your browser at: **[http://localhost:3000](http://localhost:3000)**

---

### Method 3: Direct Double Click
* Double-click **`index.html`** in your file manager to run offline in any web browser.

---

## 🔑 Login Access Credentials

* **Default Login ID:** `varalakshmi`
* **Default Password:** `murugan`
* *Note:* Any custom username and password are also accepted.

---

## 🗺️ Key System Capabilities

### 1. 🌊 Flood Management
* **Early Flood Prediction:** Real-time rainfall and river discharge telemetry with live Chart.js gauges.
* **Dynamic Zone Prediction:** 15-minute inundation zone breach visualizer.
* **Submerged Road Avoidance:** Detects flooded roads and calculates safe high-ground bypass.
* **Shelter Routing:** Real-time routing to high-ground relief centers (St. Xavier Arena, North Civic Relief).
* **Self-Adaptive Trigger:** Clicking *"Simulate Flash Surge"* automatically switches evacuation to the elevated viaduct.

### 2. 🚗 Road Accident Management
* **AI Computer Vision Crash Scanner:** Analyzes vehicle deformation, airbag deployment, and casualty severity (Levels 1–5).
* **Multi-Layer Facility Map:** Real-time locator for:
  - 💥 Crash incident site
  - 🏥 Nearby Hospitals (Apollo Memorial, St. Jude Apex, Metro General) with ICU bed telemetry
  - 🚓 Nearby Police Stations (Traffic Command HQ, Highway Patrol #12)
  - 🚒 Nearby Fire Stations (Central Station 1, Hazmat Brigade #4)
* **Self-Adaptive Hospital Failover:** Clicking *"Simulate Hospital A Saturation"* automatically redirects the ambulance to St. Jude Apex and syncs Green Corridor B-2.

### 3. 🔥 Fire Accident Management
* **4 Scenarios Supported:** Gas leak, Residential, Commercial, and Industrial chemical fires.
* **Atmospheric Dispersion Model:** Live wind vector compass (direction and speed) and downwind toxic plume cone.
* **Self-Adaptive Wind Shift:** Clicking *"Simulate Wind Shift"* dynamically rotates the plume and shifts the safe upwind evacuation corridor to Gate 1.
