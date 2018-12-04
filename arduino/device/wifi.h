const char* ground_ssid     = "H369AA74DE9";
const char* ground_password = "E59A3723C64E";
const char* attic_ssid      = "BlackAngel";
const char* attic_password  = "BUW9UCQNP7Z4";

int connectSSID(char const* ssid, char const* password) {
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

void connectWifi() {
  if (connectSSID(ground_ssid, ground_password) == 0) {
      connectSSID(attic_ssid, attic_password);
  }
}

void reconnectWifi() {
  WiFi.disconnect();
  connectWifi();
}
