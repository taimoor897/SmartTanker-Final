#if defined(ARDUINO_ARCH_ESP32)
  #include <WiFi.h>
  #include <HTTPClient.h>
#elif defined(ARDUINO_ARCH_ESP8266)
  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
#else
  #pragma message("⚠ No Wi-Fi library available — Laptop Dev Mode")
#endif

const char* ssid = "YourWiFi";
const char* password = "YourPassword";
const char* serverUrl = "http://your-server-ip:5000/api/iot/tank-level";

const int triggerPin = 5;
const int echoPin = 18;

long duration;
float distance;

void setup() {
  Serial.begin(115200);

#if defined(ARDUINO_ARCH_ESP32) || defined(ARDUINO_ARCH_ESP8266)
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\n✅ Connected to WiFi!");
#else
  Serial.println("💻 Running in Laptop Dev Mode (No WiFi).");
#endif
}

void loop() {

#if defined(ARDUINO_ARCH_ESP32) || defined(ARDUINO_ARCH_ESP8266)
  // Trigger ultrasonic sensor
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
  duration = pulseIn(echoPin, HIGH);

  // Convert to distance (cm)
  distance = duration * 0.034 / 2;

  // Map distance to percentage (adjust max depth to your tank height)
  int tankLevel = map(distance, 0, 100, 100, 0);
  Serial.print("📡 Tank Level: ");
  Serial.print(tankLevel);
  Serial.println("%");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"level\":" + String(tankLevel) + "}";
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.println("✅ Data sent to server.");
    } else {
      Serial.print("❌ Error sending data: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("⚠ WiFi disconnected.");
  }

#else
  // Laptop dev mode simulation
  Serial.println("Simulating sensor data...");
#endif

  delay(10000);
}