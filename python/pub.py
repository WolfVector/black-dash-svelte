import paho.mqtt.client as mqtt
import time, random, json

random.seed(time.perf_counter())

def get_lab_temperatures():
    array = []
    for i in range(12):
        array.append(round(random.uniform(16,33), 2))
    
    return array

client = mqtt.Client("PIC")
client.connect("localhost", 1883)

while True:
    lab_temperatures = round(random.uniform(16,33), 2)
    info = client.publish(topic="u8-mqtt/laboratories", payload=json.dumps({ "data": lab_temperatures })) #publish
    info.wait_for_publish()

    time.sleep(1)