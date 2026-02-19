import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@n7gamehub.com";
  const adminPassword = "ChangeThisPassword123!"; // change later

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await argon2.hash(adminPassword);

  await prisma.user.create({
    data: {
      email: adminEmail,
      username: "president",
      hashedPassword,
      role: "president",
    },
  });

  console.log("✅ Admin user created:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

