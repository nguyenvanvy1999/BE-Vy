#include <ESP8266WiFi.h>
#include "FirebaseESP8266.h"
#include <ArduinoJson.h>
#include <stdio.h>
#include <string.h>
#include <inttypes.h>
#include <Servo.h>
#if defined(ARDUINO) && ARDUINO >= 100#include "Arduino.h"
#else#include "WProgram.h"
#endif
#define FIREBASE_HOST "doan-eed4a-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "W8PQ0giB9VLkQPn77C8BUVpkbeE1tXMRkDdlKyEX"
#define WIFI_SSID "Tenda_CB9AA0"
#define WIFI_PASSWORD "phamducan"

String path = "/";
FirebaseJson json;
FirebaseData firebaseData;
Servo servoIn;
Servo servoOut;

void setup() {
  servoIn.attach(15); // NodeMCU D8 pin
  servoOut.attach(13); // NodeMCU D7 pin

  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  if (!Firebase.beginStream(firebaseData, path)) {
    Serial.println("Reason" + firebaseData.errorReason());
    Serial.println();
  }
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
  servoOut.write(90)
}

void closeOutDoor() {
  servoOut.write(0)
}

void loop() {
  String controlIn;
  if (Firebase.getString(firebaseData, path + "/control_in")) controlIn = firebaseData.stringData();
  Serial.println(controlIn);
  if (controlIn == "C") {
    closeInDoor();
  } else if (controlIn == "O") {
    openInDoor();
  }

  String controlOut;
  if (Firebase.getString(firebaseData, path + "/control_out")) controlOut = firebaseData.stringData();
  Serial.println(controlOut);
  if (controlOut == "C") {
    closeOutDoor();
  } else if (controlOut == "O") {
    openOutDoor();
  }
}