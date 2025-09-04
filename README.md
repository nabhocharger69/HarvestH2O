# SoilLearn 🌱

**Gamified Soil Health STEM Kit** — An IoT + TinyML powered soil health monitoring and learning kit for schools. ESP32 sensor nodes collect real‑time environmental and soil data (moisture, temperature, humidity, NPK, light, CO₂, etc.) and stream it to a web platform that turns fieldwork into quests, badges, and plant‑avatar care — making sustainability hands‑on and fun for students and easy to facilitate for teachers.

---

## ✨ Highlights

* **End‑to‑end kit**: ESP32 firmware + web platform + classroom resources.
* **Real‑time dashboards**: Live charts, gauges, and map/zone views.
* **Gamified learning**: Plant avatars, XP, quests, streaks, and badges.
* **Teacher portal**: Class management, lesson flows, exports, and rubrics.
* **TinyML edge smarts**: On‑device irrigation hints & anomaly cues.
* **Offline‑first**: Local cache with sync when Wi‑Fi returns.
* **Privacy‑aware**: Device IDs and classroom scoping; no PII required.

> **Why?** Young learners grasp sustainability faster when sensors, code, and play meet real soil and plants.

---

## 📦 Repository Structure

> This README documents the repo’s intended organization and how each part fits into the full kit. (Folder names below reflect the repository’s current top level.)

```
HarvestH2O/
├── Hardware_Kit/                 # ESP32 firmware, wiring notes, and TinyML assets
│   ├── firmware/                 # Arduino/PlatformIO sketch(es), src/, lib/, platformio.ini or .ino
│   ├── include/                  # Header files, config templates
│   ├── data/                     # SPIFFS/LittleFS assets (if used)
│   ├── models/                   # TinyML models (.tflite / .h)
│   ├── docs/                     # Pinouts, bill of materials, assembly guide
│   └── tools/                    # Calibrators, serial utils, provisioning scripts
│
├── Soillearn_Platform/           # Web app powering dashboards and gamified UI
│   ├── app/ or src/              # Frontend source (components, pages, charts)
│   ├── public/                   # Static assets (logos, icons, avatars)
│   ├── server/ or api/           # Lightweight API/backend or mock server
│   ├── db/                       # Schema/seed or local JSON storage
│   ├── .env.example              # Environment variables template
│   └── package.json              # Project manifest (scripts, deps)
│
├── Product_Demo_Pictures/        # Photos/screenshots for README & docs
│   ├── kit_*.jpg/png             # Hardware, dashboards, classroom shots
│   └── diagrams/*.png            # Architecture, wiring, flows
│
└── README.md                     # You are here
```

> **Note:** The exact files inside each folder may evolve; this map shows the intended roles so you can quickly locate what you need.

---

## 🧰 Hardware Kit

### Supported Sensors (typical)

* **Soil moisture** (capacitive)
* **Temperature & humidity** (e.g., DHT22/AM2302)
* **Barometric pressure** (e.g., BMP280)
* **Ambient light** (e.g., BH1750 / photoresistor module)
* **CO₂** (e.g., MH‑Z19B/C/E)
* **NPK** (RS‑485/Modbus soil nutrient probe, if available)

> You can deploy any subset — the firmware exposes feature flags for missing sensors.

### Example Wiring Snapshot (ESP32)

| Peripheral    | ESP32 Pins (example)          | Notes                                 |
| ------------- | ----------------------------- | ------------------------------------- |
| DHT22         | GPIO 4                        | 10k pull‑up to 3V3                    |
| BMP280 (I²C)  | SDA GPIO 21, SCL GPIO 22      | 3V3 mode                              |
| BH1750 (I²C)  | SDA GPIO 21, SCL GPIO 22      | Share I²C bus                         |
| Soil moisture | ADC GPIO 34                   | Use capacitive probe; avoid 5V probes |
| MH‑Z19 CO₂    | UART2: RX GPIO 16, TX GPIO 17 | 5V power, logic OK via UART           |
| NPK (RS‑485)  | UART1 + RE/DE control         | Use MAX485; external 12V for probe    |

> Double‑check pin mappings with your board (e.g., ESP32‑DevKitC vs WROOM module) and update config accordingly.

### Firmware Features

* Non‑blocking sensor reads, debounced and sanity‑checked
* NTP‑synced timestamps (local offset configurable)
* JSON telemetry packets over WebSocket/HTTP‑POST/MQTT (selectable)
* Basic calibration & sensor‑fault handling
* Optional **TinyML inference** (e.g., over/under‑watering hints)
* **OTA updates** (HTTP/ESP‑OTA) — optional

### Build & Flash (Arduino IDE)

1. Install **ESP32** boards via Boards Manager (latest stable).
2. Libraries you’ll likely need:

   * `DHT sensor library`, `Adafruit Unified Sensor`
   * `Adafruit BMP280` (or BME280 variant)
   * `BH1750`
   * `ArduinoJson`
   * `WebSocketsClient` / `PubSubClient` (if using WS/MQTT)
3. Open `Hardware_Kit/firmware/*.ino` and set Wi‑Fi + server/MQTT endpoint.
4. Select **Board**: ESP32 Dev Module, choose the right **Port**, and **Upload**.

### Build & Flash (PlatformIO)

```bash
# from Hardware_Kit/firmware
pio run -t upload
pio device monitor --baud 115200
```

### Telemetry Format (example)

```json
{
  "device_id": "esp32-abc123",
  "ts": "2025-09-04T10:22:31Z",
  "sensors": {
    "soil": {"moisture": 0.56},
    "env": {"temp_c": 28.1, "rh": 63.2, "pressure_hpa": 1006.4},
    "light": {"lux": 213},
    "co2": {"ppm": 612},
    "npk": {"n": 17, "p": 8, "k": 21}
  }
}
```

---

## 🕹️ Soillearn Platform (Web App)

### What it does

* **Device onboarding**: claim a node, give it a name/zone.
* **Live dashboard**: line charts, gauges, and trend cards.
* **Gamification**: XP, streaks, plant avatar health, achievement badges.
* **Teacher tools**: class rosters, lesson scripts, printable worksheets, CSV export.
* **Alerts**: configurable thresholds (e.g., soil < 30% → water quest).

### Quick Start

```bash
# 1) Install deps
cd Soillearn_Platform
npm install   # or: pnpm install / yarn

# 2) Set environment
cp .env.example .env
# then edit .env with your dev server/MQTT settings, classroom name, etc.

# 3) Run dev
npm run dev
# open the URL printed by the dev server
```

### Typical Scripts (package.json)

* `dev` — start local dev server
* `build` — production build
* `preview` — serve the production build locally

> If a backend is included (e.g., `server/`), follow its README or run `npm run server` in a second terminal.

### Minimal Data Ingest Options

* **WebSocket**: firmware → platform’s WS endpoint
* **HTTP POST**: firmware pushes `/api/ingest`
* **MQTT**: firmware publishes to `harvesth2o/<device_id>/telemetry`

---

## 🚦 Run the Whole Thing (Demo)

### One‑Node Quick Demo

1. Flash firmware to one ESP32 (Wi‑Fi set to your LAN).
2. Start the web app (`npm run dev`).
3. Watch the dashboard for your `device_id` appearing in \~10–20s.
4. Simulate conditions (shine a light, breathe near CO₂ sensor, water soil) and see badges/quests trigger.

### Classroom Multi‑Node

* Provision each node with unique `device_id` and the same classroom key.
* Use **Zones** (Garden A/B/C) to split stations.
* Teacher portal → create groups, assign quests, export results.

---

## 🧪 Testing & Calibration

* Serial monitor prints **self‑check** results on boot (sensor presence & ranges).
* Use `tools/` calibrators to capture dry/wet baselines and CO₂ zero‑point.
* Save calibration constants to `config.h` or non‑volatile storage.

---

## 🔐 Privacy & Safety

* Classroom‑scoped data, pseudonymous device IDs.
* No student PII required to use dashboards.
* All sensors are low‑voltage; follow standard lab safety for wiring and watering.

---

## 📷 Media & Docs

* Check `Product_Demo_Pictures/` for kit photos, UI screenshots, and diagrams.
* Place new assets here and reference them from this README (see below).

```md
![Kit overview](Product_Demo_Pictures/kit_overview.jpg)
![Dashboard sample](Product_Demo_Pictures/dashboard_sample.png)
```

---

## 🗺️ Architecture (at a glance)

```
[ Sensors ]→[ ESP32 Node ]→(WS/HTTP/MQTT)→[ Soillearn Platform ]→[ Badges/Quests/Reports ]
                 │                                   │
                 └── TinyML hints (optional)         └── Local cache & sync
```

---

## ⚙️ Configuration

Create or edit a config header / env file:

**Firmware** (`config.h` or `secrets.h`):

```c
#define WIFI_SSID     "..."
#define WIFI_PASS     "..."
#define DEVICE_ID     "esp32-abc123"
#define USE_WEBSOCKET 1
#define USE_HTTP      0
#define USE_MQTT      0
// Sensor toggles
#define HAS_DHT22     1
#define HAS_BMP280    1
#define HAS_BH1750    1
#define HAS_CO2       1
#define HAS_NPK       0
```

**Web App** (`.env`):

```
VITE_WS_URL=ws://localhost:5173/ws
VITE_HTTP_INGEST=http://localhost:5173/api/ingest
VITE_MQTT_URL=ws://broker.hivemq.com:8000/mqtt (example)
CLASSROOM_KEY=demo-class-a
```

---

## 📦 Deployment

* **Firmware OTA**: host `.bin` on local server; nodes check `/ota/manifest.json`.
* **Web app**: Deploy static build to Netlify/Vercel or host Node server.
* **MQTT**: Use a managed broker (HiveMQ, Mosquitto) or local container.

---

## 🧭 Roadmap Ideas

* 🌱 More quests & seasonal challenges
* 🧠 Auto‑tuned TinyML per classroom (transfer learning)
* 🛰️ LoRaWAN option for outdoor plots
* 🔔 Smart notifications (email/WhatsApp via webhook)
* 📊 Teacher analytics by week/term

---

## 🤝 Contributing

1. Fork and create a feature branch.
2. Follow code style and add helpful comments.
3. Open a PR with screenshots for UI changes and sample telemetry for firmware changes.

### Good First Issues

* Add a new badge/quest
* Add a new sensor driver toggle
* Improve calibration UX on the dashboard

---

## 📄 License

Recommendation: **MIT** for permissive reuse in schools. If you choose something else, add a `LICENSE` file at the repo root and update this section.

---

## 🧰 Troubleshooting

* **No data on dashboard** → Check Wi‑Fi credentials, server URL, and that the device clock is synced (NTP). Verify with `pio device monitor`.
* **CO₂ reads 0** → Ensure MH‑Z19 has 5V supply and correct UART pins; wait \~3–5 minutes for warm‑up.
* **I²C sensors missing** → Confirm 3V3, common ground, and pull‑ups; run an I²C scanner.
* **NPK probe no response** → Check RS‑485 DE/RE enables and 12V supply; verify Modbus address.

---

## 🙌 Acknowledgements

Built by the HarvestH2O team. Thanks to the open‑source sensor libraries and the STEM educators who piloted the kit.

Nabhonil Bhatacharjee (https://github.com/nabhocharger69)
Arko Manna (https://github.com/Arka-Manna)
Jyotirmoy Karmakar (https://github.com/0xjyotirmoy)
Jeet Biswas (https://github.com/JEETB03)

---

## 📝 Changelog (suggested)

* **v0.1.0**: Public repo, initial hardware + platform skeleton.
* **v0.2.0**: Gamification MVP, classroom exports, OTA support.
