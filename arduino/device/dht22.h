#define DHTPIN 4
#define DHTTYPE DHT22

#include <DHT.h>
#include <DHT_U.h>

struct Measurement {
    float temperature;
    float humidity;
};

DHT* dht;

void setupDHT22() {
    pinMode(DHTPIN, INPUT);
    dht = new DHT(DHTPIN, DHTTYPE);
    dht->begin();
}

Measurement readDHT22() {
    float h = dht->readHumidity();
    float t = dht->readTemperature();

    return { t, h };
}
