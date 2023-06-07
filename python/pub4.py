import paho.mqtt.client as mqtt
import time, random, json

random.seed(time.perf_counter())

#u8-mqtt/laboratories

def get_lab_temperatures():
    array = []
    for i in range(12):
        array.append(round(random.uniform(16,33), 2))
    
    return array

client = mqtt.Client("PIC4")
client.connect("localhost", 1883)

while True:
    lab_temperatures = round(random.uniform(80,95), 0)
    value = round(random.uniform(12,43), 2)
    info = client.publish(topic="u8-mqtt/room4", payload=json.dumps({ "noise": lab_temperatures, "temp": value })) #publish
    info.wait_for_publish()

    time.sleep(1)