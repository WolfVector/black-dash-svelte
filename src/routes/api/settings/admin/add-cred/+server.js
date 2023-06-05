import prisma from '$lib/db/prisma';
import { json } from '@sveltejs/kit';
import { object, string, ref } from 'yup';
import bcrypt from "bcrypt";
import { PASSWORD_SALTROUND } from '$env/static/private';

export async function POST(event) {
  const session = await event.locals.getSession()
  const body = await event.request.json()

  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  let adminSchema = object({
    username: string().required("Username is required"),
    password: string().required("Password is required").min(8, 'Password must be 8 characters minimum'),
    confirmPassword: string().oneOf([ref("password"), null], 'Passwords does not match')
  })
  
  let userParsed = ''
  try {
    userParsed = await adminSchema.validate(body, { abortEarly: false })
  } catch (error) {
    return json({ ok: false, messages: error.errors })
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(userParsed.password, parseInt(PASSWORD_SALTROUND) || 10)

  try {
    // Create user
    await prisma.admin.create({
      data: {
        username: userParsed.username,
        password: passwordHash
      }
    })
  } catch (error) {
    return json({ ok: false, messages: ["There was a problem while creating the user"] })
  }

  return json({ ok: true })
}