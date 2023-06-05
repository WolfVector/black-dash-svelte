export async function load(event) {
  let res = await event.fetch("/api/settings/mqtt/broker")
  res = await res.json()

  return {
    broker: res[0] || { url: '', port: '', portType: 'websocket' }
  }
}