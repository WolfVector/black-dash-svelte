import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
  const saltround = parseInt(process.env.PASSWORD_SALTROUND) || 10
  const passwordHash = await bcrypt.hash(process.env.DEFAULT_PASSWORD, saltround)
  const username = process.env.DEFAULT_ADMIN

  const admin = await prisma.admin.create({
    data: {
      username,
      password: passwordHash
    }
  })

  const admin_settings = await prisma.adminSettings.create({
    data: {
      microsoftSSO: false,
      credentialsProvider: true,
      ipRestricted: true
    }
  })

  console.log("admin:", admin)
  console.log("admin_settings", admin_settings)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
