
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <Servo.h>

#define WIFI_SSID "MERCUSYS_95AA"
#define WIFI_PASSWORD "phamducan"

#define API_KEY "AIzaSyA-5IRQGWEJLblqImYz_2s9Jw16-LXOA50"
#define DATABASE_URL "doan-eed4a-default-rtdb.asia-southeast1.firebasedatabase.app"
#define USER_EMAIL "esp8266@email.com"
#define USER_PASSWORD "123456"

#define TRIGGER1 D1
#define ECHO1 D2
#define TRIGGER2 D5
#define ECHO2 D6

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

Servo servoIn;
Servo servoOut;

void openInDoor() {
  servoIn.write(180);
}

void closeInDoor() {
  servoIn.write(-90);
}

void openOutDoor() {
  servoOut.write(180);
}

void closeOutDoor() {
  servoOut.write(-90);
}

int getDistanceSensor(int sensor) {
  unsigned long duration;
  int distance;
  if (sensor == 1) {
    digitalWrite(TRIGGER1, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIGGER1, HIGH);
    delayMicroseconds(5);
    digitalWrite(TRIGGER1, LOW);
    duration = pulseIn(ECHO1, HIGH);
  } else if (sensor == 2) {
    digitalWrite(TRIGGER2, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIGGER2, HIGH);
    delayMicroseconds(5);
    digitalWrite(TRIGGER2, LOW);
    duration = pulseIn(ECHO2, HIGH);
  }

  distance = int(duration / 2 / 29.412);
  Serial.printf("Distance %d", distance);
  return distance;
}


void setup() {
  servoIn.attach(15);   // NodeMCU D8 (GP15) pin
  servoOut.attach(13);  // NodeMCU D7 (GP13) pin
  pinMode(TRIGGER1, OUTPUT);
  pinMode(ECHO1, INPUT);
  pinMode(TRIGGER2, OUTPUT);
  pinMode(ECHO2, INPUT);
  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  unsigned long ms = millis();
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;
  fbdo.setBSSLBufferSize(2048, 2048);
  fbdo.setResponseSize(2048);
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Firebase.setDoubleDigits(5);
  config.timeout.serverResponse = 10 * 1000;
}

void loop() {
  if (Firebase.ready()) {
    String controlIn = Firebase.RTDB.getString(&fbdo, F("/control_in")) ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    Serial.println(controlIn);
    if (controlIn == "C") {
      closeInDoor();
    } else if (controlIn == "O") {
      openInDoor();
    }

    String controlOut = Firebase.RTDB.getString(&fbdo, F("/control_out")) ? fbdo.to<const char *>() : fbdo.errorReason().c_str();
    Serial.println(controlOut);
    if (controlOut == "C") {
      closeOutDoor();
    } else if (controlOut == "O") {
      openOutDoor();
    }
    int distance1 = getDistanceSensor(1);
    int distance2 = getDistanceSensor(2);
    Serial.printf("Distance 1...", distance1);
    Serial.printf("Distance 2...", distance2);

    Serial.printf("Set distance 1... %s\n", Firebase.RTDB.setInt(&fbdo, F("/out_distance_1"), distance1) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set distance 2... %s\n", Firebase.RTDB.setInt(&fbdo, F("/out_distance_2"), distance2) ? "ok" : fbdo.errorReason().c_str());
  }
}
