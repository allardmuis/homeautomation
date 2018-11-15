struct Response {
    int status;
    String body;
};

Response makeRequest(String host, String httpMethod, String url, String data="") {
    WiFiClientSecure client;
    if (!client.connect(host, 443)) {
        return {
          0, ""
        };
    }

    if (httpMethod == "GET" && data) {
        url = url + "?" + data;
    }

    String header = httpMethod + " " + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n";
    String body = "";
    if (httpMethod == "POST") {
        header = header + "Content-Type: application/json\r\n";
        header = header + "Content-Length: " + String(data.length()) + "\r\n";
        body = data + "\r\n";
    }

    client.print(header + "\r\n" + body);
    
    int status = 0;
    while (client.connected()) {
        String line = client.readStringUntil('\n');
        if (line.startsWith("HTTP/1.1")) {
            status = line.substring(8).toInt();
        }
        if (line == "\r") {
            break;
        }
    }
    String response = client.readStringUntil('\n');

    Serial.println(String(status) + " " + response);
    return {
        status, response
    };
}
