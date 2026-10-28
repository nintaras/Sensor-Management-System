# Sensor Management System: Full-Stack IoT Telemetry & Monitoring Dashboard

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-Flask_REST_API-3776AB?style=flat&logo=python&logoColor=white)](https://flask.palletsprojects.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%2FSQL-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An end-to-end full-stack web telemetry dashboard engineered for real-time sensor network registration, state tracking, and metric monitoring. The system combines an asynchronous Python/Flask RESTful backend with a reactive Vite/React frontend, delivering interactive data visualization, dynamic threshold controls, and persistent relational logging.

---

## Architectural Overview

The application adopts a decoupled client-server architecture:

```text
Sensor-Management-System/
├── backend/
│   ├── app.py              # Flask REST API endpoints & route controllers
│   ├── seed.py             # Database initialization & mock sensor generator
│   └── database_dump.sql   # Relational database schema & baseline records
├── frontend/
│   ├── src/                # Modular React UI components & state hooks
│   ├── public/             # Static UI assets & telemetry icons
│   ├── vite.config.js      # Vite compilation & proxy configuration
│   └── package.json        # Frontend dependencies & build scripts
└── README.md


---

## Key Features

- **RESTful Telemetry API (Backend):**
  - Full CRUD operations for sensor nodes (temperature, humidity, motion, pressure).
  - State management (`ACTIVE`, `INACTIVE`, `ALERT`) and telemetry threshold verification.
  - Relational SQL data persistence with automated database seeding routines.
- **Reactive UI & Monitoring Interface (Frontend):**
  - Real-time tabular and visual overview of all registered sensors.
  - Instant metric filtering, search, and dynamic status updates without page reload.
  - Modular component architecture with fast Hot Module Replacement (HMR) powered by Vite.

---

## Installation & Local Development

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm

---

### Backend Setup
From the repository root:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors
python3 seed.py
python3 app.py

The Flask server will start locally at http://127.0.0.1:5000.

Frontend Setup
In a new terminal window from the repository root:
cd frontend
npm install
npm run dev

The Vite development server will launch at http://localhost:5173.

API Endpoints Summary

Method	Endpoint	Description
GET	/api/sensors	Retrieve all registered sensors and current metrics
GET	/api/sensors/<id>	Fetch detailed telemetry data for a specific sensor
POST	/api/sensors	Register a new sensor node into the network
PUT	/api/sensors/<id>	Update sensor status, location, or thresholds
DELETE	/api/sensors/<id>	Remove a sensor node from the management system