import { json } from '@sveltejs/kit'
import prisma from '$lib/db/prisma'

export async function GET(event) {
  const session = await event.locals.getSession()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  if(!event.params.topic) return json([])
  
  try {
    let topics = await prisma.mqttTopic.findUnique({ 
      where: { id: event.params.topic },
      select: {
        id: true,
        title: true,
        topic: true,
        keyFields: {
          select: {
            id: true,
            keyField: true,
            fieldTitle: true,
            fieldUnits: true
          }
        }
      }
    })
    return json(topics)
  } catch (error) {
    return json(null)
  }
}