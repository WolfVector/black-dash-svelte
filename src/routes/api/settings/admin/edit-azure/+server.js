import prisma from '$lib/db/prisma';
import { json } from '@sveltejs/kit';
import { object, string,ValidationError } from 'yup';
import isEmailValidator from 'validator/lib/isEmail';

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })
  
  let adminSchema = object({
    username: string()
      .required("You must enter a valid email")
      .test("is-valid", (message) => 'The email is invalid', (value) => value ? isEmailValidator(value) : new ValidationError("Invalid value"))
  })
  
  let userParsed = ''
  try {
    userParsed = await adminSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }

  if(!body.oldUsername) return json({ ok: false, messages: ["Something went wrong when updating the user"] })

  try {
    // Update user
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
    return json({ ok: false, messages: ["There was a problem while updating the admin email"] })
  }

}