/*******************************************************
 * ESP32 Multi-Sensor → JSON → HTTP POST to Laptop
 *
 * Sensors: DHT22 (GPIO15), BMP280 (I2C),
 *          BH1750 (I2C), HS-S20B (ADC GPIO34)
 * 
 * GPS & CO2 removed → replaced with natural/random values:
 *    GPS: Noida fixed coords (28.544485, 77.333141, alt≈210m, sats 7–12, hdop 0.8–1.5)
 *    CO2: Random 420–520 ppm (urban realistic range)
 * 
 * NEW:
 *    NPK sensor values (simulated realistic mg/kg)
 *    Ambient brightness (simulated extra LDR sensor)
 *******************************************************/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <DHT.h>
#include <BH1750.h>
#include <time.h>
#include <stdlib.h>

// ------------ USER CONFIG ------------
const char* WIFI_SSID     = "Galaxy_A14_5G";
const char* WIFI_PASSWORD = "nabho69charger";

const char* SERVER_HOST = "10.174.46.46";   // <-- CHANGE THIS
const uint16_t SERVER_PORT = 5000;
const char* SERVER_PATH = "/ingest";

const char* DEVICE_ID = "esp32-env1";
const unsigned long SEND_INTERVAL_MS = 5000;

const char* TZ_INFO = "IST-5:30";
// ------------------------------------

// Pins
#define DHTPIN 4
#define DHTTYPE DHT22
#define HS_S20B_PIN 34  // input-only ADC

// Objects
DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;
BH1750 bh1750;

unsigned long lastSend = 0;

// ---------- Helpers ----------
String isoTimestampNow() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return String("1970-01-01T00:00:00+00:00");
  }
  char buf[40];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S+05:30", &timeinfo);
  return String(buf);
}

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("WiFi: connecting");
  int dots = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
    if (++dots % 20 == 0) Serial.println();
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
}

bool postJSON(const String& json) {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  HTTPClient http;
  String url = String("http://") + SERVER_HOST + ":" + String(SERVER_PORT) + SERVER_PATH;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int code = http.POST((uint8_t*)json.c_str(), json.length());
  bool ok = (code >= 200 && code < 300);

  Serial.printf("POST %s -> %d\n", url.c_str(), code);
  if (!ok) {
    Serial.printf("Response: %s\n", http.getString().c_str());
  }
  http.end();
  return ok;
}

// --- Simulators ---
// CO2 ppm between 420–520
int fakeCO2() {
  return random(420, 520);
}

// GPS snapshot for Noida
void fakeGPS(double &lat, double &lon, double &alt, int &sats, double &hdop) {
  lat = 28.544485;
  lon = 77.333141;
  alt = 210.0 + random(-5, 6);
  sats = random(7, 13);
  hdop = 0.8 + (random(0, 8) / 10.0);
}

// Soil nutrients NPK (mg/kg, realistic for agriculture)
void fakeNPK(int &n, int &p, int &k) {
  n = random(20, 120);  // Nitrogen
  p = random(5, 60);    // Phosphorus
  k = random(40, 200);  // Potassium
}

// Extra ambient brightness (LDR-like, lux)
float fakeAmbientBrightness() {
  return random(50, 800); // 50–800 lux
}

void setup() {
  Serial.begin(115200);
  delay(200);

  Wire.begin(21, 22);
  dht.begin();

  if (!bmp.begin(0x76)) {
    Serial.println("BMP280 not found at 0x76, trying 0x77...");
    if (!bmp.begin(0x77)) {
      Serial.println("ERROR: BMP280 not found!");
    }
  }
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,
                  Adafruit_BMP280::SAMPLING_X2,
                  Adafruit_BMP280::SAMPLING_X16,
                  Adafruit_BMP280::FILTER_X16,
                  Adafruit_BMP280::STANDBY_MS_63);

  if (!bh1750.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
    Serial.println("ERROR: BH1750 begin failed!");
  }

  connectWiFi();
  configTzTime(TZ_INFO, "pool.ntp.org", "time.nist.gov", "time.google.com");
  delay(1500);

  randomSeed(analogRead(34));
  Serial.println("Setup complete.");
}

void loop() {
  unsigned long now = millis();
  if (now - lastSend < SEND_INTERVAL_MS) return;
  lastSend = now;

  String ts = isoTimestampNow();

  // DHT22
  float dht_h = dht.readHumidity();
  float dht_t = dht.readTemperature();

  // BMP280
  float bmp_t = NAN, bmp_p = NAN, bmp_alt = NAN;
  if (bmp.sensorID() != 0xFF) {
    bmp_t = bmp.readTemperature();
    bmp_p = bmp.readPressure() / 100.0f;
    bmp_alt = bmp.readAltitude(1013.25);
  }

  // BH1750
  float lux = bh1750.readLightLevel();

  // HS-S20B
  int hs_raw = analogRead(HS_S20B_PIN);
  float hs_ratio = hs_raw / 4095.0f;

  // Fake sensors
  double lat, lon, alt;
  int sats; double hdop;
  fakeGPS(lat, lon, alt, sats, hdop);

  int co2ppm = fakeCO2();
  int npk_n, npk_p, npk_k;
  fakeNPK(npk_n, npk_p, npk_k);

  float amb_brightness = fakeAmbientBrightness();

  // JSON
  StaticJsonDocument<1024> doc;
  doc["device"] = DEVICE_ID;
  doc["ts"] = ts;

  JsonObject sensors = doc.createNestedObject("sensors");

  JsonObject gpsj = sensors.createNestedObject("gps");
  gpsj["lat"] = lat;
  gpsj["lon"] = lon;
  gpsj["alt_m"] = alt;
  gpsj["sat"] = sats;
  gpsj["hdop"] = hdop;

  JsonObject dhtj = sensors.createNestedObject("dht22");
  if (!isnan(dht_t)) dhtj["temp_c"] = dht_t;
  if (!isnan(dht_h)) dhtj["hum_pct"] = dht_h;

  JsonObject bmpj = sensors.createNestedObject("bmp280");
  if (!isnan(bmp_t))   bmpj["temp_c"] = bmp_t;
  if (!isnan(bmp_p))   bmpj["press_hpa"] = bmp_p;
  if (!isnan(bmp_alt)) bmpj["alt_m"] = bmp_alt;

  JsonObject bhj = sensors.createNestedObject("bh1750");
  if (!isnan(lux)) bhj["lux"] = lux;

  JsonObject hsj = sensors.createNestedObject("hs_s20b");
  hsj["adc_raw"] = hs_raw;
  hsj["ratio"] = hs_ratio;

  JsonObject co2j = sensors.createNestedObject("mh_z19e");
  co2j["co2_ppm"] = co2ppm;

  JsonObject npkj = sensors.createNestedObject("npk");
  npkj["n_mgkg"] = npk_n;
  npkj["p_mgkg"] = npk_p;
  npkj["k_mgkg"] = npk_k;

  JsonObject ambj = sensors.createNestedObject("ambient_brightness");
  ambj["lux"] = amb_brightness;

  String out;
  serializeJson(doc, out);

  Serial.println("JSON payload:");
  Serial.println(out);

  postJSON(out);
}