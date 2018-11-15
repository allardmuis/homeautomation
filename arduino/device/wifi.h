int connectWifi(char const* ssid, char const* password) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    int tries = 0;
    while (WiFi.status() != WL_CONNECTED) {
        tries++;
        if (tries > 20) {
          return 0;
        }
        delay(500);
        Serial.print(".");
    }
    Serial.println(String("Connected to ") + ssid);
    return 1;
}
