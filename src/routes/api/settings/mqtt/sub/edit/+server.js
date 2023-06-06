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

  const updateFields = []
  const createFields = []

  Object.entries(body.keyFields).forEach(([key, value]) => {
    if(value.id) updateFields.push({ keyField: key, fieldTitle: value.title, fieldUnits: value.units, id: value.id })
    else createFields.push({ keyField: key, fieldTitle: value.title, fieldUnits: value.units })
  })
  
  console.log(updateFields)
  console.log(createFields)

  /*const mqttCreateFields = Object.entries(body.keysTotCreate).map(([key, value]) => {
    return { keyField: key, fieldTitle: value.title, fieldUnits: value.units }
  })*/

  try {
    const topics = await prisma.mqttTopic.update({
      where: {
        id: body.id
      },
      data: {
        title: topicParsed.title,
        topic: topicParsed.topic,
        keyFields: {
          create: createFields,
        }
      },
      include: {
        keyFields: true
      }
    })

    await prisma.$transaction(updateFields.map(row => {
      return prisma.mqttTopic.update({
        where: {
          id: body.id
        },
        data: {
          keyFields: {
            update: {
              where: {
                id: row.id
              },
              data: {
                keyField: row.keyField,
                fieldTitle: row.fieldTitle,
                fieldUnits: row.fieldUnits
              }
            }
          }
        }
      })
    }))

    return json({ ok: true, keyFields: topics.keyFields })
  } catch (error) {
    return json({ ok: false, message: ["There was a problem while updating the topic and title"] })   
  }
}