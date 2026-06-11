#include <WiFi.h>
#include <HTTPClient.h>

#define TRIG_PIN 25
#define ECHO_PIN 26

const char* ssid = "Infinix HOT 50i";
const char* password = "irtaza1234";

const char* serverURL = "http://10.221.83.1:5000/api/iot/tank-distance";


// Maximum attempts to read sensor
#define MAX_RETRIES 5

float getDistance() {
  for(int i = 0; i < MAX_RETRIES; i++) {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
    if(duration > 0) {
      return duration * 0.034 / 2; // distance in cm
    }
    delay(50); // wait a bit before retry
  }
  return -1; // failed to read
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  delay(2000); // give sensor some time to power up
  Serial.println("Starting WiFi connection...");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float distance = getDistance();

    if(distance == -1) {
      Serial.println("Sensor read failed, retrying next loop...");
    } else {
      HTTPClient http;
      http.begin(serverURL);
      http.addHeader("Content-Type", "application/json");

      String payload = "{\"distance\": " + String(distance) + "}";
      int httpResponseCode = http.POST(payload);
      http.end();

      Serial.println("Distance sent: " + String(distance) + " cm, Response: " + String(httpResponseCode));
    }
  } else {
    Serial.println("WiFi not connected!");
  }

  delay(5000); // wait before next read
}

