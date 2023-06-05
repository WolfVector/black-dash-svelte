import prisma from "$lib/db/prisma";
import { json } from "@sveltejs/kit";

export async function GET(event) {
  const session = await event.locals.getSession()
  const username = event.params.user
  
  // Check if the user is allow to perform this action
  if(session.user.rol == "user") return json({ ok: false, messages: ["There was a problem while checking the session"] })

  try {
    const user = await prisma.admin.findUnique({
      where: {
        username
      },
      select: {
        username: true,
        password: true
      }
    })

    return json({ username: user.username, cred: user.password ? true : false})
  } catch (error) {
    return json(null)
  }
}