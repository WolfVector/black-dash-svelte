import { redirect } from "@sveltejs/kit";
export async function load(event) {
  const session = await event.locals.getSession()
  if(session?.user) throw redirect(307, '/settings')
}