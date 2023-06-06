import { json } from '@sveltejs/kit'
import prisma from '$lib/db/prisma'

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })
  else if(!body.topic) return json({ ok: false, messages: ["Bad request"] })

  // Delete the topic
  try {
    await prisma.mqttTopic.delete({
      where: {
        topic: body.topic
      }
    })

    return json({ ok: true })
  } catch (error) {
    return json({ ok: false, messages: ["There was a problem while trying to delete the topic"] })
  }
}