import { CustomerSubmissionStatus, PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword("123456");

  // Create Admin
  await prisma.user.create({
    data: {
      username: "admin",
      hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Create Users
  const customerSubmissionStatuses = Object.values(CustomerSubmissionStatus);

  const users = Array.from({ length: 10 }, (_, index) => {
    const id = index + 1;
    return {
      data: {
        username: `user${id}`,
        hashedPassword,
        customerSubmission: {
          create: {
            email: `user${id}@user${id}.com`,
            name: `User ${id}`,
            status:
              customerSubmissionStatuses[
                index % customerSubmissionStatuses.length
              ],
            documentFilename: `user${id}.pdf`,
          },
        },
      },
    };
  });

  for (const user of users) {
    await prisma.user.create(user);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
