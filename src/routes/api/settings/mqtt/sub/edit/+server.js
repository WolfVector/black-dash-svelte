import { json } from '@sveltejs/kit'
import { object, string } from 'yup';
import prisma from '$lib/db/prisma'

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  let topicSchema = object({
    title: string().required('The title is required'),
    topic: string().required("The topic is required"),
  })

  let topicParsed = ''
  try {
    topicParsed = await topicSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }

  if(!body.oldTopic) return json({ ok: false, messages: ["There was a problem while validating the data"] })

  const mqttFields = Object.entries(body.keysTotCreate).map(([key, value]) => {
    return { keyField: key, fieldTitle: value.title, fieldUnits: value.units }
  })

  try {
    await prisma.mqttTopic.update({
      where: {
        id: body.id
      },
      data: {
        title: topicParsed.title,
        topic: topicParsed.topic,
        keyFields: {
          create: mqttFields    
        }
      }
    })

    await prisma.mqttTopic.update({
      where: {
        id: body.id
      },
      data: {
        keyFields: {
          deleteMany: body.deleteKeys
        }
      }
    })

  } catch (error) {
    return json({ ok: false, message: ["There was a problem while updating the topic and title"] })   
  }

  console.log("keyFields", body.keyFields)
  console.log("keysToDelete", body.deleteKeys)
  console.log("keyToCreate",body.keysTotCreate)

  return json({ ok: true })
}