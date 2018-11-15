#define DHTPIN 4
#define DHTTYPE DHT22

struct Measurement {
    int temperature;
    int humidity;
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
    int temperature = int(t * 10);
    int humidity = int(h * 10);

    return { temperature, humidity };
}
