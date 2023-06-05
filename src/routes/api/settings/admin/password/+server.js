import { object, string, ref } from 'yup';
import { json } from '@sveltejs/kit'
import { PASSWORD_SALTROUND } from "$env/static/private"
import prisma from '$lib/db/prisma';
import bcrypt from "bcrypt";
 
export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(!session?.user.black_dash_credentials || session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  let adminSchema = object({
    newPassword: string().required('New password is required').min(8, 'Password must be 8 characters minimum'),
    confirmNewPassword: string().oneOf([ref("newPassword"), null], 'The new password does not match')
  })

  let userParsed = ''
  try {
    userParsed = await adminSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }

  // Hash the new password
  const passwordHash = await bcrypt.hash(userParsed.newPassword, parseInt(PASSWORD_SALTROUND) || 10)

  try {
    // Update the user
    await prisma.admin.update({
      where: {
        username: session.user.email,
      },
      data: {
        password: passwordHash
      }
    })
  } catch (error) {
    json({ ok: false, messages: ["Something went wrong when updating the user. Perhaps you have change your username in this session, if you did, then sign out and sign in so you can change your password"] })
  }


  return json({ ok: true })
}

