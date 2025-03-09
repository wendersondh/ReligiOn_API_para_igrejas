import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  userType: 'LEADER' | 'MEMBER',
  phone?: string,
  image?: string
) => {

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      image,
      role,
      userType,
    },
  });
  return newUser;
};

export const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};
