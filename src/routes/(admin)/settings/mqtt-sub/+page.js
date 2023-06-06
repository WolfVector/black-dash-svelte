export async function load(event) {
  const res = await event.fetch("/api/settings/mqtt/sub/all")

  return {
    topics: await res.json()
  }
}