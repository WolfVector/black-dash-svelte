export async function load(event) {
  let res = await event.fetch(`/api/admin/${event.params.user}`)
  res = await res.json()

  if(!res) return { messages: [`User '${event.params.user}' not found`] }

  return {
    user: res 
  }
}