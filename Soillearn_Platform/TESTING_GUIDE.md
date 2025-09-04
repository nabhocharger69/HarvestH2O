# Device Dashboard Testing Guide

## Prerequisites
1. Ensure your React development server is running: `npm run dev`
2. Verify ESP32 device is accessible at `http://10.173.244.46:5000/latest`
3. Open browser to `http://localhost:5173`

## Step-by-Step Testing

### 1. Navigate to Device Dashboard
1. Open the SoilLearn application
2. Go to **Student Dashboard** or **Student Profile**
3. Click on **"My Device"** in the sidebar navigation
4. You should see the Device Dashboard loading

### 2. Test ESP32 Connectivity
**Expected Behavior:**
- Loading spinner appears initially
- Connection status shows "Connected" with green wifi icon
- Device ID displays as "esp32-env1"
- Last update timestamp shows current time

**If Connection Fails:**
- Error message displays with retry button
- Connection status shows "Disconnected" with red wifi-off icon
- Click "Retry Connection" to attempt reconnection

### 3. Verify Sensor Data Display

#### Environmental Conditions Section
- **Temperature**: Should show DHT22 reading (~25-26°C) with BMP280 comparison
- **Humidity**: Should display ~99.9% (high humidity warning - orange border)
- **Pressure**: Should show ~984 hPa with altitude reading
- **CO2**: Should display ~443 ppm (normal range - green border)

#### Light Conditions Section
- **BH1750**: Should show ~435 lux
- **Ambient**: Should show ~117 lux

#### Soil Monitoring Section
- **Soil Moisture**: Should show 100% (saturated - orange warning border)
- **Nitrogen (N)**: Should show ~78 mg/kg (green border)
- **Phosphorus (P)**: Should show ~55 mg/kg (purple border)
- **Potassium (K)**: Should show ~74 mg/kg (orange border)

#### Location Data Section
- **Latitude**: ~28.544485°
- **Longitude**: ~77.333141°
- **Satellites**: 11 satellites
- **GPS Altitude**: ~209m

### 4. Test Auto-Refresh Functionality
1. **Auto-refresh ON** (default):
   - Data updates every 5 seconds
   - "Last Update" timestamp changes
   - Auto-refresh status shows "ON"

2. **Toggle Auto-refresh**:
   - Click "Pause Auto-refresh" button
   - Updates stop
   - Status shows "OFF"
   - Click "Start Auto-refresh" to resume

3. **Manual Refresh**:
   - Click "Refresh" button
   - Loading state appears briefly
   - Data updates immediately

### 5. Test Color-Coded Warnings

#### Green Borders (Normal Range):
- Temperature: 15-35°C
- Humidity: 30-80%
- Soil Moisture: 30-90%
- CO2: <800 ppm

#### Orange Borders (Warning):
- Temperature: <15°C or >35°C
- Humidity: <30% or >80%
- Soil Moisture: <30% or >90%
- CO2: 800-1000 ppm

#### Red Borders (Critical):
- CO2: >1000 ppm

### 6. Test Responsive Design
- **Desktop**: All sensor cards in grid layout
- **Tablet**: Cards stack appropriately
- **Mobile**: Single column layout

## Troubleshooting

### Common Issues:

1. **CORS Error**:
   ```
   Access to fetch at 'http://10.173.244.46:5000/latest' from origin 'http://localhost:5173' has been blocked by CORS policy
   ```
   **Solution**: ESP32 server needs CORS headers enabled

2. **Network Error**:
   ```
   Failed to fetch
   ```
   **Solution**: Check if ESP32 device is online and accessible

3. **Invalid Data Format**:
   ```
   Invalid data format received
   ```
   **Solution**: Verify ESP32 returns expected JSON structure

### Testing Commands:

```bash
# Test ESP32 endpoint directly
curl http://10.173.244.46:5000/latest

# Start development server
npm run dev

# Check network connectivity
ping 10.173.244.46
```

## Expected Data Structure

The ESP32 should return data in this format:
```json
{
  "ok": true,
  "latest": {
    "client_payload": {
      "device": "esp32-env1",
      "sensors": {
        "dht22": {"temp_c": 25.4, "hum_pct": 99.9},
        "bmp280": {"temp_c": 26.17, "press_hpa": 984.83, "alt_m": 239.36},
        "bh1750": {"lux": 434.99},
        "ambient_brightness": {"lux": 117},
        "mh_z19e": {"co2_ppm": 443},
        "hs_s20b": {"adc_raw": 4095, "ratio": 1},
        "npk": {"n_mgkg": 78, "p_mgkg": 55, "k_mgkg": 74},
        "gps": {"lat": 28.544485, "lon": 77.333141, "alt_m": 209, "sat": 11, "hdop": 1.1}
      },
      "ts": "2025-09-04T09:04:05+05:30"
    },
    "server_time_iso_local": "2025-09-04T09:04:04+05:30"
  }
}
```

## Success Criteria

✅ Dashboard loads without errors
✅ ESP32 connection established
✅ All sensor readings display correctly
✅ Auto-refresh works (5-second intervals)
✅ Manual refresh functions
✅ Color coding shows appropriate warnings
✅ Responsive design works on all screen sizes
✅ Data persists in localStorage via dataManager
