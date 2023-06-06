export async function load(event) {
  
  /*let res = null

  if(event.params.topic) {
    res = await event.fetch(`/api/mqtt/sub/${event.params.topic}`)
    res = await res.json()
  }*/

  let broker = await event.fetch("/api/settings/mqtt/broker")
  broker = await broker.json()

  return {
    topics: { title: '', topic: '', keyFields: {} },
    broker: broker[0] || "no-mqtt"
  }
}