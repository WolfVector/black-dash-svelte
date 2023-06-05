export async function load(event) {
  const res = await event.fetch("/api/admin/all")

  return {
    users: await res.json() || []
  }
}