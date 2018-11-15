#define DEVICE_ID 1
#define DEVICE_TYPE "SENSOR"

#include <DHT.h>
#include <DHT_U.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

#include "wifi.h"
#include "request.h"
#include "dht22.h"

const char* ground_ssid     = "H369AA74DE9";
const char* ground_password = "E59A3723C64E";
const char* attic_ssid      = "ZZZZ";
const char* attic_password  = "ZZZZ";

const String host = "ukcxcr2gi1.execute-api.eu-west-1.amazonaws.com";

void setup() {
    Serial.begin(115200);
    Serial.println();
    if (connectWifi(ground_ssid, ground_password) == 0) {
        connectWifi(attic_ssid, attic_password);
    }

    if (DEVICE_TYPE == "SENSOR") {
        setupDHT22();
    }
}

void loop() {
    unsigned long startTime = millis();
    unsigned long loopTime = 30 * 1000;
  
    if (DEVICE_TYPE == "SENSOR") {
        Measurement data = readDHT22();
        Serial.println(data.temperature);
        makeRequest(host, "POST", "/test/measurements", String("") + "{\"temperature\":"+ data.temperature +",\"humidity\":"+ data.humidity +",\"deviceId\":" + DEVICE_ID + "}");
        loopTime = 20 * 1000;
    }

    unsigned long duration = millis() - startTime;
    if (loopTime > duration) {
        delay(loopTime - duration);
    }
}






/*
void work() {
    int temperature;
    int humidity;
    readData(temperature, humidity, dht1);
    sendData(temperature, humidity, sensor1);
}

void sendData(int temperature, int humidity, const char* sensor) {
    if (temperature > 1000 || temperature < -500) {
        return;
    }
    
    WiFiClient client;
    if (!client.connect(host, httpPort)) {
        return;
    }

    String url = "/api";
    String messageBody = String("temperature=") + temperature + "&humidity=" + humidity + "&sensor=" + sensor + "&secret=" + secret;
  
    client.print(String("POST ") + url + " HTTP/1.1\r\n" +
               "Host: " + host_name + "\r\n" + 
               "Content-Type: application/x-www-form-urlencoded\r\n" +
               "Content-Length: " + messageBody.length() + "\r\n" +
               "Connection: close\r\n\r\n" +
               messageBody + "\r\n"
               );
    delay(500);

}
*/
