
#include <Servo.h>
#include <grove_two_rgb_led_matrix.h>
#include <Wire.h>
#include <SD.h>
#include <SPI.h>
#include <WiFiEsp.h>
#include <PubSubClient.h>

// Définitions des broches et des constantes
#define TRIGG 9
#define ECHO 8
#define SERVO_PIN 5
#define DISTANCE_SEUIL 20.0
#define SD_CS 4

// Informations d'identification Wi-Fi
char ssid[] = "VOTRE_SSID";
char password[] = "VOTRE_MOT_DE_PASSE";

// Paramètres du serveur MQTT
char mqtt_server[] = "BROKER_MQTT_IP";
int mqtt_port = 1883;
char mqtt_topic[] = "detector/objetos";

// Objets globaux
WiFiEspClient espClient;
PubSubClient client(espClient);
Servo myservo;
GroveTwoRGBLedMatrixClass matrix;

// Fonction pour mesurer la distance à l'aide du capteur à ultrasons
int measureDistance() {
    digitalWrite(TRIGG, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIGG, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIGG, LOW);
    int duration = pulseIn(ECHO, HIGH);
    return duration * 0.034 / 2;
}

// Fonction pour afficher un emoji sur la matrice LED en fonction de la distance
void displayEmoji(int distance) {
    Serial.print("Distance : ");
    Serial.print(distance);
    Serial.println(" cm");
    if (distance >= 0 && distance < DISTANCE_SEUIL) {
        matrix.displayEmoji(2, 1000, false); // Emoji d'alerte
    } else {
        matrix.displayEmoji(7, 1000, false); // Emoji neutre
    }
}

// Fonction pour se connecter au Wi-Fi
void connectWiFi() {
    Serial.print("Connexion au Wi-Fi");
    unsigned long startMillis = millis();
    while (WiFi.status() != WL_CONNECTED) {
        if (millis() - startMillis > 30000) {  // Timeout de 30 segundos
            Serial.println("Échec de connexion Wi-Fi !");
            return;
        }
        Serial.print(".");
        WiFi.begin(ssid, password);
        delay(5000);
    }
    Serial.println("\nConnecté au Wi-Fi !");
}


// Fonction pour se reconnecter au serveur MQTT
void reconnectMQTT() {
    while (!client.connected()) {
        Serial.print("Connexion au serveur MQTT...");
        if (client.connect("ArduinoClient")) {
            Serial.println("connecté !");
            client.subscribe(mqtt_topic);
        } else {
            Serial.print("échec, rc=");
            Serial.print(client.state());
            Serial.println(" nouvelle tentative dans 5 secondes");
            delay(5000);
        }
    }
}

// Fonction pour capturer et enregistrer une image sur la carte SD
void captureAndSaveImage() {
        // Salvar a imagem na SD
    File imageFile = SD.open("photo.jpg", FILE_WRITE);
    if (imageFile) {
        camera.saveToSD(imageFile);
        imageFile.close();
        Serial.println("Imagem capturada e salva!");
    } else {
        Serial.println("Falha ao salvar imagem!");
    }
}


// Fonction pour envoyer des données au serveur MQTT
void sendDataToServer(const char* message) {
    if (!client.connected()) {
        reconnectMQTT();
    }
    client.publish(mqtt_topic, message);
}


void setup() {
    Serial.begin(115200);
    Serial3.begin(115200);
    WiFi.init(&Serial3);

    pinMode(TRIGG, OUTPUT);
    pinMode(ECHO, INPUT);
    Wire.begin();
    myservo.attach(SERVO_PIN);
    myservo.write(0);

    connectWiFi();
    client.setServer(mqtt_server, mqtt_port);

    if (!SD.begin(SD_CS)) {
        Serial.println("Échec de l'initialisation de la carte SD !");
        return;
    }
    Serial.println("Carte SD initialisée avec succès !");
}

void loop() {
    if (!client.connected()) {
        reconnectMQTT();
    }
    client.loop();

    for (int pos = 0; pos <= 180; pos += 10) {
        int distance = measureDistance();
        if (distance < DISTANCE_SEUIL) {
            captureAndSaveImage();
            displayEmoji(distance);
            String message = "Objet détecté à " + String(distance) + " cm";
            sendDataToServer(message);
        }
        myservo.write(pos);
        delay(500); // Petit délai pour stabiliser le servomoteur
    }

    for (int pos = 180; pos >= 0; pos -= 10) {
        int distance = measureDistance();
        if (distance < DISTANCE_SEUIL) {
            captureAndSaveImage();
            displayEmoji(distance);
            String message = "Objet détecté à " + String(distance) + " cm";
            sendDataToServer(message);
        }
        myservo.write(pos);
        delay(500); // Petit délai pour stabiliser le servomoteur
    }
}
