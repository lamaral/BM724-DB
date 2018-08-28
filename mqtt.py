import time
import paho.mqtt.client as paho
import msgpack

broker="bm.dvbrazil.com.br"

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msgpack.unpackb(msg.payload)))
#    print(msg.topic+" "+str(msg.payload))

client= paho.Client("mqtt-test")

client.on_message=on_message

print("connecting to broker ",broker)
client.connect(broker)#connect
print("subscribing ")
client.subscribe("Registry/LastHeard/#")#subscribe
client.subscribe("BRHeard/#")#subscribe
#client.subscribe("Registry/LastHeard/+/7242/+/7240021/7")
client.loop_forever() #stop loop