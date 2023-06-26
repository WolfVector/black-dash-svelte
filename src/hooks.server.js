import { AUTH_SECRET, AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID } from "$env/static/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import AzureAd from "@auth/core/providers/azure-ad";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "$lib/db/prisma";

export const authOptions = {
  providers: [
    AzureAd({
      clientId: AZURE_AD_CLIENT_ID,
      clientSecret: AZURE_AD_CLIENT_SECRET,
      tenantId: AZURE_AD_TENANT_ID,
      authorization: { params: { scope: "openid profile user.Read email" } },
      
    }),
    Credentials({
      async authorize(credentials, req) {
        const user = await prisma.admin.findUnique({
          where: {
            username: credentials.email,
          }
        })

        if(!user) return null

        const passwordCompare = await bcrypt.compare(credentials.password, user.password)
        if(!passwordCompare) return null

        return { email: user.username, image: null, name: "black-dash-admin", black_dash_credentials: true, role: "admin" }
      }
    })
  ],
  secret: AUTH_SECRET,
  pages: {
    /* Page where we will show our custom signin page  */
    signIn: '/login'
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, trigger, user, session, account  }) {
      if(trigger === "update" && session?.email) token.email = session.email
      if(user) token.black_dash_credentials = user.black_dash_credentials ? user.black_dash_credentials : false
      if(account && !token.rol) {
        const user = await prisma.admin.findUnique({
          where: {
            username: token.email,
          }
        })

        token.rol = "user"
        if(user) token.rol = "admin"
      }

      return token
    },

    async session({ session, token }) {
      if(session?.user) { 
        session.user.black_dash_credentials = token.black_dash_credentials 
        session.user.rol = token.rol
      }

      return session
    },
  }
}

async function authorization({ event, resolve }) {
  //console.log(event.url.protocol)

  // Protect any routes under /settings
  if (event.url.pathname.startsWith("/settings")) {
    const session = await event.locals.getSession();
    if (!session || session.user.rol == "user") {
      throw redirect(303, "/");
    }
  }

  // If the request is still here, just proceed as normally
  return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle = sequence(SvelteKitAuth(authOptions), authorization);
//export { handler as GET, handler as POST }