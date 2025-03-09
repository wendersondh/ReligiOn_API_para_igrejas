import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = 'secreta';

// Função para criar usuário
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

// Função para autenticar usuário
export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Comparar as senhas
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Senha incorreta');
  }

  // Gerar o token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user, token };
};

// Função para obter usuário
export const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};
