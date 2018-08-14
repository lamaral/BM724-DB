import time
import paho.mqtt.client as paho

broker="bm.dvbrazil.com.br"

def on_message(client, userdata, message):
    time.sleep(1)
    print("received message = ",str(message.payload.decode("utf-16le")))

client= paho.Client("mqtt-test")

client.on_message=on_message

print("connecting to broker ",broker)
client.connect(broker)#connect
client.loop_start() #start loop to process received messages
print("subscribing ")
client.subscribe("Master/7242/+/Message/#")#subscribe
time.sleep(2)
print("publishing ")
client.publish("Master/7242/Outgoing/Message/724990/7240021","Test".encode("utf-16le"))#publish
time.sleep(4)
client.disconnect() #disconnect
client.loop_stop() #stop loop