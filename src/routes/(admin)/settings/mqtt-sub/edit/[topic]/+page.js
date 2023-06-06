export async function load(event) {
  
  let res = await event.fetch(`/api/mqtt/sub/${event.params.topic}`)
  res = await res.json()

  //console.log(res)

  let broker = await event.fetch("/api/settings/mqtt/broker")
  broker = await broker.json()

  if(!res) res = { title: '', topic: '', keyFields: {} }
  else {
    let keyFields = {}
    res.keyFields.forEach(obj => {
      keyFields[obj.keyField] = { title: obj.fieldTitle, units: obj.fieldUnits, id: obj.id }
    });

    res.keyFields = keyFields
  }

  return {
    topics: res,
    broker: broker[0] || "no-mqtt"
  }
}