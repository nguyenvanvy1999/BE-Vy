#include <ESP8266WiFi.h>;                       //https://github.com/esp8266/Arduino
#include <WiFiClient.h>;

#include <ThingSpeak.h>;                        //https://github.com/mathworks/thingspeak-arduino
#include <OneWire.h>                            //https://github.com/PaulStoffregen/OneWire
#include <DallasTemperature.h>                  //https://github.com/milesburton/Arduino-Temperature-Control-Library

#define ONE_WIRE_BUS 12                         // Define data pin for tempsensor
#define trigPin 5                               // Define Trig pin
#define echoPin 4                               // Define Echo pin

OneWire oneWire(ONE_WIRE_BUS);
WiFiClient client;
DallasTemperature tempSensor(&oneWire);

const char* ssid = "MY Wi-Fi";               //Your Network SSID
const char* password = "MYWIFIPASSWORD";             //Your Network Password

unsigned long ChannelNumber = 1023056;            //Channel Number
const char * WriteAPIKey = "you dont need this lol";    //Write API Key


float freshData, calcDistance, distance, initialMedian, rawSpeedOfSound, calcSpeedOfSound, currentTemp;


float initialData[25];
int initialReadings = 25;                         //number of data points to chose initial median out of

float refinedData[5];
int refinedReadings = 5;                          //number of intital median points collected before chosing a refined median

float pureData[5];
int pureReadings = 5;                             //number of refined medians collected before being averaged

float tempBuffer[15];
int tempReadings = 15;                            //number of initail tempature readings before choosing a median and calculating SOS

float refinedTemp[5];
int refinedTempReadings = 5;                              //number of SOS data collected before calculating current SOS


void setup() {
  pinMode(trigPin, OUTPUT);                       //setup trigerPin as an output
  pinMode(echoPin, INPUT);                        //setup echoPin as an input
  tempSensor.begin();                             //start tempsensor
  Serial.begin(9600);                             //start serial monitor at a baud rate of 9600
  Serial.println("\n5 Seconds to clear Serial");
  delay(5000);
  Serial.println("\n---STARTING UP---");
  Serial.println("Starting Wifi  ");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print("*");
  }
  Serial.println("\nWiFi Connection Successful");
  Serial.print("Connected to: ");
  Serial.println(ssid);
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());                 // Print the IP address
  Serial.println("\n");
  ThingSpeak.begin(client);

}


void connectToWifi() {
  Serial.println("\nWIFI HAS BECOME DISCONECTED!!!");
  Serial.println("Reconnecting ");
  while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print("*");
  }
  Serial.println("Reconnection Sucsessful\n");
}
void getSOS(){
  float calcRefinedTemp = 0;                                  //set to 0 for every calculation or it will double over time
  for (int i = 1; i <= refinedTempReadings; i++){
    writeTempData(tempBuffer,tempReadings);                 //collect tempature data
    sortData(tempBuffer,tempReadings);                      //Sort tempature data collected
    refinedTemp[i-1] = tempBuffer[(tempReadings-1)/2];  //get median out of tempBuffer then calculate the speed of sound
  }
  sortData(refinedTemp,refinedTempReadings);                          //Pass in the values and the size.
  for (int i = 0; i < refinedTempReadings; i++){
    calcRefinedTemp = calcRefinedTemp + refinedTemp[i];
  }

  calcSpeedOfSound = (331.3 * sqrt(1+((calcRefinedTemp / refinedTempReadings)/273.15))/1000);           //calculate the curent speed of sound
  currentTemp = calcRefinedTemp / refinedTempReadings;
}

void writeTempData(float data[], int size){
  for (int i = 0 ; i < size; i++){
    tempSensor.requestTemperatures();
    delay(100);
    data[i]=tempSensor.getTempCByIndex(0);
  }
}

void getDist(){
  float pureDataTotal = 0;                                  //set to 0 for every calculation or it will double over time
  for (int i = 1; i <= pureReadings; i++){
    for (int i = 1; i <= refinedReadings; i++){
      writeDist(initialData, initialReadings);
      sortData(initialData, initialReadings);               //Pass in the values and the size.
      initialMedian = initialData[(initialReadings - 1) / 2];
      refinedData[i-1] = initialMedian;
    }
    sortData(refinedData, refinedReadings);                 //Pass in the values and the size.
    pureData[i-1] = refinedData[refinedReadings / 2];
  }
  for (int i = 0; i < pureReadings; i++){
    pureDataTotal = pureDataTotal + pureData[i];
  }
  calcDistance = pureDataTotal / (pureReadings+1);
}

void writeDist(float data[], int size){
  for (int i = 0 ; i < initialReadings; i++){
    distance = ping() * calcSpeedOfSound / 2;   //calls funtion ping() and calculate the results
    initialData[i] = distance;
    delay(10);
  }
}

float ping(){             //function for collecting data
    float indata;
    digitalWrite(trigPin, LOW); // Clear the trigPin by setting it LOW:
    delayMicroseconds(20);
    digitalWrite(trigPin, HIGH);  // Trigger the sensor by setting the trigPin high for 10 microseconds:
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    indata = pulseIn(echoPin, HIGH);
    return indata;
}

void sortData(float data[], int size) {
  float swapper;
    for(int i = 0; i<(size-1); i++) {
        for(int o = 0; o<(size-(i+1)); o++) {
            if(data[o] > data[o+1]) {
                swapper = data[o];
                data[o] = data[o+1];
                data[o+1] = swapper;
            }
        }
    }
}


void loop() {
  if (WiFi.status() != WL_CONNECTED){                       //----Ensure Wi-Fi connection---
    connectToWifi();
  }
  getSOS();
  getDist();
  Serial.print(currentTemp); Serial.println(" °C");
  Serial.print(calcSpeedOfSound*1000); Serial.println(" m/s");
  Serial.print(calcDistance); Serial.println(" mm\n");
  ThingSpeak.setField(1, (calcSpeedOfSound * 1000));
  ThingSpeak.setField(2, calcDistance);
  ThingSpeak.setField(3, currentTemp);
  ThingSpeak.writeFields(ChannelNumber, WriteAPIKey); //Update in ThingSpeak
}