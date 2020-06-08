#include <DHT.h>
#include <SocketIoClient.h>
#include <ESP8266WiFi.h>
#include <LiquidCrystal_I2C.h>


LiquidCrystal_I2C lcd(0x27,16,2);
const int DHTPIN=2;
const int DHTTYPE = DHT11;
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "Kiet";
const char* password = "123456789";

const int Den=14;
const int Quat=12;
const char* server= "192.168.43.2";
int port = 2323;
const int sendingInternval=2000;
SocketIoClient client;



void setupNetwork() {
    WiFi.begin(ssid, password);
    uint8_t i = 0;
    while (WiFi.status() != WL_CONNECTED && i++ < 20) delay(500);
    if (i == 21) {
        while (1) delay(500);
    }
     Serial.println("Wifi connected!");
}
void BatDen(const char* data, size_t length) {
  String chuoi=(String) data;
    if (chuoi == "off") {
        digitalWrite(Den, HIGH);
      
    } else {
        digitalWrite(Den, LOW);
       }
}

void BatQuat(const char* data, size_t length){
 String chuoi=(String) data;
  if (chuoi =="off"){
    digitalWrite(Quat,HIGH);
    
    }else{
      digitalWrite(Quat,LOW);
     }
      }
void setup() {
  dht.begin();
    pinMode(Den, OUTPUT);
    pinMode(Quat, OUTPUT);
    digitalWrite(Den, HIGH);
    digitalWrite(Quat, HIGH);
    Serial.begin(115200);
    setupNetwork();
    lcd.init();
    lcd.backlight();
  // put your setup code here, to run once:
client.on("BatDen", BatDen);
client.on("BatQuat",BatQuat); 

client.begin(server,2323);
}

void loop() {
float temp =dht.readTemperature();
  float humi =dht.readHumidity();
  if (isnan(temp) || isnan(humi)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  lcd.print("Nhiet do:   ");
    lcd.print(round(temp));
    lcd.setCursor(0,1);
    lcd.print("Do Am:     ");
    lcd.print(round(humi));
        char ok[100];
        sprintf(ok, "{\"NhietDo\":%5.0f,\"DoAm\":%f }",temp,humi);
        Serial.println(ok);
        const char* ThongSo = ok;
         client.emit("NodeMCU_send_data", ThongSo);
         delay(2000);
 
 client.loop();
}
