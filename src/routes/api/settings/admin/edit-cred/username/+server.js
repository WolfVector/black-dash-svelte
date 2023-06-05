import prisma from "$lib/db/prisma"
import { object, string, ref } from 'yup';
import { json } from "@sveltejs/kit"

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  let adminSchema = object({
    username: string().required('Username is required'),
  })

  let userParsed = ''
  try {
    userParsed = await adminSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }

  if(!body.oldUsername) return json({ ok: false, messages: ["Somenthing went wrong when updating the user"] })

  try {
    await prisma.admin.update({
      where: {
        username: body.oldUsername
      },
      data: {
        username: userParsed.username,
      }
    })

    return json({ ok: true })
  } catch (error) {
    return json({ ok: false, messages: ["User could not be updated. If you have already updated your username, then sign out and sign in so you can change your username again"] })
  }

}