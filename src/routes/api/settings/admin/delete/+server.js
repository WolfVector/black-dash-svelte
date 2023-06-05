import prisma from "$lib/db/prisma"
import { json } from "@sveltejs/kit"

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  try {
    await prisma.admin.delete({
      where: {
        username: body.username
      }
    })
  } catch(error) {
    return json({ ok: false })
  }

  return json({ ok: true })
}