import { json } from '@sveltejs/kit'
import prisma from '$lib/db/prisma'

export async function GET(event) {
  const session = await event.locals.getSession()

  // Check if the user is allow to perform this action
  //if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  return json(await prisma.mqttTopic.findMany({
    select: {
      title: true,
      topic: true,
      keyFields: {
        select: {
          keyField: true,
          fieldTitle: true,
          fieldUnits: true
        }
      }
    }
  }))
}