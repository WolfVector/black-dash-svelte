import { json } from '@sveltejs/kit'
import { object, string, ValidationError } from 'yup';
import prisma from '$lib/db/prisma'
import isEmailValidator from 'validator/lib/isEmail';

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  let adminSchema = object({
    username: string().required("The email is required").test("is-valid", (message) => 'The email is invalid', (value) => value ? isEmailValidator(value) : new ValidationError("Invalid value"))
  })
  
  let userParsed = ''
  try {
    userParsed = await adminSchema.validate(body, { abortEarly: false })
  } catch (error) {
    console.log("sss")
    return json({ ok: false, messages: error.errors })
  }

  console.log(userParsed)

  // Create user
  const admin = await prisma.admin.create({
    data: {
      username: userParsed.username,
    }
  })

  if(!admin) return json({ ok: false, messages: ["DB Error: there was a problem while creating the user"] })

  return json({ ok: true })
}