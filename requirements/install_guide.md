# Installation Guide - SEVC 2025 Student Car Project

This project consists of two parts: the **Mobile Dashboard (Frontend)** and the **Raspberry Pi Servers (Backend)**.

## 1. Mobile Dashboard (Frontend)
The frontend is built with React Native and Expo.

### Prerequisites
- Node.js **20.11.1+** installed on your computer (required for SDK 52 compatibility).

### Installation Command
Run the following command in the root `Carapp` directory:
```bash
npm install
```

---

## 2. Raspberry Pi Server (Backend)
The backend scripts run on the car's Raspberry Pi.

### Prerequisites
- Python 3.10+ installed on the Pi.
- A virtual environment (recommended).

### Installation Commands
Run these commands on the Raspberry Pi:

1. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements/pi_requirements.txt
   ```

3. **Install system-level camera dependencies (if needed):**
   ```bash
   sudo apt-get update
   sudo apt-get install libgl1-mesa-glx -y
   ```

---

## 3. Running the Project

### On the Pi:
```bash
bash pi/start.sh
```

### On your development machine:
```bash
npx expo start
```
