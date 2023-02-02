#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <stdio.h>
#include <string.h>
#include <inttypes.h>
#include <Servo.h>
#include <Firebase_ESP_Client.h>

#define FIREBASE_HOST "doan-eed4a-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "W8PQ0giB9VLkQPn77C8BUVpkbeE1tXMRkDdlKyEX"
#define API_KEY "AIzaSyA-5IRQGWEJLblqImYz_2s9Jw16-LXOA50"
#define WIFI_SSID "Tenda_CB9AA0"
#define WIFI_PASSWORD "phamducan"
#define USER_EMAIL "esp8266@email.com"
#define USER_PASSWORD "123456"

String path = "/";
FirebaseJson json;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
Servo servoIn;
Servo servoOut;

// config firebase
config.host = FIREBASE_HOST;
config.api_key = API_KEY;
config.signer.test_mode = true;
auth.user.email = USER_EMAIL;
auth.user.password = USER_PASSWORD;


void setup() {
  servoIn.attach(15);   // NodeMCU D8 pin
  servoOut.attach(13);  // NodeMCU D7 pin

  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

void openInDoor() {
  servoIn.write(90);
}

void closeInDoor() {
  servoIn.write(0);
}

void openOutDoor() {
  servoOut.write(90);
}

void closeOutDoor() {
  servoOut.write(0);
}

void loop() {
  String controlIn;
  if (Firebase.RTDB.getString(&fbdo, "/control_in")) {
    controlIn = fbdo.to<String>();
  }
  Serial.println(controlIn);
  if (controlIn == "C") {
    closeInDoor();
  } else if (controlIn == "O") {
    openInDoor();
  }

  String controlOut;
  if (Firebase.RTDB.getString(&fbdo, "/control_out")) {
    controlOut = fbdo.to<String>();
  }
  Serial.println(controlOut);
  if (controlOut == "C") {
    closeOutDoor();
  } else if (controlOut == "O") {
    openOutDoor();
  }
}