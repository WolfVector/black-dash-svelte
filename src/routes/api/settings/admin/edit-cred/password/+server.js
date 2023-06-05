import { object, string, ref } from 'yup';
import prisma from '$lib/db/prisma';
import bcrypt from "bcrypt";
import { json } from '@sveltejs/kit';
import { PASSWORD_SALTROUND } from '$env/static/private';

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  let adminSchema = object({
    password: string().required('New password is required').min(8, 'Password must be 8 characters minimum'),
    confirmPassword: string().oneOf([ref("newPassword"), null], 'The new password does not match')
  })

  let userParsed = ''
  try {
    userParsed = await adminSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }

  if(!body.oldUsername) return json({ ok: false, messages: ["Somenthing went wrong when updating the user"] })

  // Hash the new password
  const passwordHash = await bcrypt.hash(userParsed.password, parseInt(PASSWORD_SALTROUND) || 10)

  try {
    // Update the user
    user = await prisma.admin.update({
      where: {
        username: body.oldUsername,
      },
      data: {
        password: passwordHash
      }
    })

    return json({ ok: true })
  } catch (error) {
    return json({ ok: false, messages: ["Something went wrong when updating the user. If you have updated your username, then sign out and sign in so you can change your username and password again"] })
  }

}
