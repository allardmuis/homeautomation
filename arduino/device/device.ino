#define SENSOR 1
#define GROUP 2

#define DEVICE_ID 1
#define DEVICE_TYPE SENSOR

#if DEVICE_TYPE == SENSOR
#include <ESP8266WiFi.h>
#include "dht22.h"

#elif DEVICE_TYPE == GROUP
#include <WiFiClientSecure.h>
#include "tmp36.h"
#endif

#include "wifi.h"
#include "request.h"


const char* host = "ukcxcr2gi1.execute-api.eu-west-1.amazonaws.com";

void setup() {
    Serial.begin(115200);
    Serial.println();
    connectWifi();

    #if DEVICE_TYPE == SENSOR
        setupDHT22();
    #endif

    #if DEVICE_TYPE == GROUP
        setupTMP36();
    #endif
}

void loop() {
    int num = 0;
  
    unsigned long startTime = millis();
    unsigned long loopTime = 30 * 1000;
  
    #if DEVICE_TYPE == SENSOR
        Measurement data = readDHT22();
        Serial.println(data.temperature);
        makeRequest(host, "POST", "/test/measurements", String("") + "{\"temperature\":"+ data.temperature +",\"humidity\":"+ data.humidity +",\"deviceId\":" + DEVICE_ID + "}");
        loopTime = 60 * 1000;
    #endif

    #if DEVICE_TYPE == GROUP
        GroupMeasurement data = readAllTMP36();
        Serial.println(String("") + data.group1 + " " + data.group2 + " " + data.group3 + " " + data.group4 + " " + data.group5 + " "  + data.incoming);
        String json = String("") + "{\"deviceId\":" + DEVICE_ID;
        bool hasData = false;
        if (data.group1 > 10 && data.group1 < 70) {
            json = json + "\"group1\":" + data.group1;
            hasData = true;
        }
        if (data.group2 > 10 && data.group2 < 70) {
            json = json + ",\"group2\":" + data.group2;
            hasData = true;
        }
        if (data.group3 > 10 && data.group3 < 70) {
            json = json + ",\"group3\":" + data.group3;
            hasData = true;
        }
        if (data.group4 > 10 && data.group4 < 70) {
            json = json + ",\"group4\":" + data.group4;
            hasData = true;
        }
        if (data.group5 > 10 && data.group5 < 70) {
            json = json + ",\"group5\":" + data.group5;
            hasData = true;
        }
        if (data.incoming > 10 && data.incoming < 70) {
            json = json + ",\"incoming\":" + data.incoming;
            hasData = true;
        }
        json = json + "}";
        if (hasData) {
            makeRequest(host, "POST", "/test/measurements", json);
        }
        
        loopTime = 60 * 1000;
    #endif

    unsigned long duration = millis() - startTime;
    if (loopTime > duration) {
        delay(loopTime - duration);
    }

    num++;
    if (num >= 900) {
      reconnectWifi();
      num = 0;
    }
}
