
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

float calcDistance, distance, initialMedian;
float calcSpeedOfSound = 0.03313;  //calculate the curent speed of sound (cm/microsecond)

int initialReadings = 2;  //number of data points to chose initial median out of

int refinedReadings = 2;  //number of intital median points collected before chosing a refined median

int pureReadings = 2;  //number of refined medians collected before being averaged

void openInDoor() {
  servoIn.write(180);
}

void closeInDoor() {
  servoIn.write(-90);
}

void openOutDoor() {
  servoOut.write(-270);
}

void closeOutDoor() {
  servoOut.write(180);
}

float getDist(int sensor) {
  float pureDataTotal = 0;  //set to 0 for every calculation or it will double over time
  float initialData[3];
  float refinedData[3];
  float pureData[3];

  for (int i = 1; i <= pureReadings; i++) {
    for (int i = 1; i <= refinedReadings; i++) {
      writeDist(initialData, initialReadings, sensor);
      sortData(initialData, initialReadings);  //Pass in the values and the size.
      float initialMedian = initialData[(initialReadings - 1) / 2];
      refinedData[i - 1] = initialMedian;
    }
    sortData(refinedData, refinedReadings);  //Pass in the values and the size.
    pureData[i - 1] = refinedData[(refinedReadings - 1) / 2];
  }
  for (int i = 0; i < pureReadings; i++) {
    pureDataTotal = pureDataTotal + pureData[i];
  }
  float calcDistance = pureDataTotal / (pureReadings + 1);
  return calcDistance;
}

void writeDist(float data[], int size, int sensor) {
  for (int i = 0; i < size; i++) {
    float distance = ping(sensor) * calcSpeedOfSound / 2;  //calls funtion ping() and calculate the results
    data[i] = distance;
    delay(10);
  }
}

int ping(int sensor) {  //function for collecting data
  if (sensor == 1) {
    float indata;
    digitalWrite(TRIGGER1, LOW);  // Clear the trigPin by setting it LOW:
    delayMicroseconds(2);
    digitalWrite(TRIGGER1, HIGH);  // Trigger the sensor by setting the trigPin high for 10 microseconds:
    delayMicroseconds(20);
    digitalWrite(TRIGGER1, LOW);
    indata = pulseIn(ECHO1, HIGH);
    return indata;
  } else {
    float indata;
    digitalWrite(TRIGGER2, LOW);  // Clear the trigPin by setting it LOW:
    delayMicroseconds(2);
    digitalWrite(TRIGGER2, HIGH);  // Trigger the sensor by setting the TRIGGER2 high for 10 microseconds:
    delayMicroseconds(20);
    digitalWrite(TRIGGER2, LOW);
    indata = pulseIn(ECHO2, HIGH);
    return indata;
  }
}

void sortData(float data[], int size) {
  float swapper;
  for (int i = 0; i < (size - 1); i++) {
    for (int o = 0; o < (size - (i + 1)); o++) {
      if (data[o] > data[o + 1]) {
        swapper = data[o];
        data[o] = data[o + 1];
        data[o + 1] = swapper;
      }
    }
  }
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
    float distance1 = getDist(1);
    float distance2 = getDist(2);
    Serial.printf("Distance 1...", distance1);
    Serial.printf("Distance 2...", distance2);

    Serial.printf("Set distance 1... %s\n", Firebase.RTDB.setFloat(&fbdo, F("/in_distance_1"), distance1) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set distance 2... %s\n", Firebase.RTDB.setFloat(&fbdo, F("/in_distance_2"), distance2) ? "ok" : fbdo.errorReason().c_str());
  }
}
