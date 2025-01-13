import { Role } from "@prisma/client";
import prisma from "../config/prisma";

const usersDao = {
  createUser: async (user: CreateUser) => {
    return prisma.user.create({
      data: {
        username: user.username,
        hashedPassword: user.hashedPassword,
        role: Role.USER,
      },
    });
  },

  getUserByUsername: async (username: string) => {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  },

  getUserById: async (id: number) => {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  countUsers: async () => {
    return prisma.user.count({
      where: {
        role: Role.USER,
      },
    });
  },
};

export default usersDao;

type CreateUser = {
  username: string;
  hashedPassword: string;
};
