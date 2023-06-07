export async function load(event) {
  let res = await event.fetch("/api/settings/mqtt/broker")
  res = await res.json()

  let topics = []
  if(res !== "no-mqtt") {
    topics = await event.fetch("/api/mqtt/sub/all")
    topics = await topics.json()
  }

  return {
    broker: res[0] || "no-mqtt",
    topics
  }
}