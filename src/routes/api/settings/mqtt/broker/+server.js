import { json } from '@sveltejs/kit'
import prisma from '$lib/db/prisma'
import { object, string, number } from 'yup';

export async function GET(event) {
  const session = await event.locals.getSession()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  return json(await prisma.mqttConnector.findMany())
}

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  let brokerSchema = object({
    url: string().required('Url is required'),
    port: number().required("The port number is required"),
    portType: string().required("A port type is required")
  })

  let brokerParsed = ''
  try {
    brokerParsed = await brokerSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }

  try {
    await prisma.mqttConnector.upsert({
      create: {
        url: brokerParsed.url,
        port: brokerParsed.port,
        portType: brokerParsed.portType
      },
      update: {
        url: brokerParsed.url,
        port: brokerParsed.port,
        portType: brokerParsed.portType
      },
      where: {
        url: brokerParsed.url,
      }
    })

    return json({ ok: true })
  } catch (error) {
    console.log(error)
    return json({ ok: false, messages: ["There was a proble while updating the MQTT Connector"] })
  }
}