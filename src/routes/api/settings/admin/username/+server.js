import { json } from '@sveltejs/kit'
import prisma from '$lib/db/prisma'
import { object, string } from 'yup';

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(!session?.user.black_dash_credentials || session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })
  
  let adminSchema = object({
    username: string().required('Username is required'),
  })

  let userParsed = ''
  try {
    userParsed = await adminSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }
  
  /*
  --------------------------------
   TODO: Check if user exists
   Consider implementing this security layer when sveltekit auth offers a way to update the session.
   For now, relay in protected routes using a "role" property. 
  
  let user = await prisma.admin.findUnique({
    where: {
      username: session.user.email
    }
  })

  if(!user) return json({ ok: false, messages: ["The session is wrong"] })
  ---------------------------------------------
  */

  // Update the user

  try {
    await prisma.admin.update({
      where: {
        username: session.user.email,
      },
      data: {
        username: userParsed.username,
      }
    })
} catch (error) {
  return json({ ok: false, messages: ["Something went wrong when updating the user. Perhaps you have already change your username, if you did, then sign out and sign in so you can change your username"] })
}


  return json({ ok: true })
}