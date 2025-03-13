import { PrismaClient, UserType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'secreta';

// Função para validar e-mail
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar criação de usuário
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  userType: 'LEADER' | 'MEMBER',
  phone?: string,
  image?: string
) => {
  if (!name || !email || !password || !role || !userType) {
    throw new Error('Todos os campos obrigatórios devem ser preenchidos');
  }
  
  if (!isValidEmail(email)) {
    throw new Error('E-mail inválido');
  }

  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  if (!(userType in UserType)) {
    throw new Error('Tipo de usuário inválido');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: { name, email, password: hashedPassword, phone, image, role, userType },
  });
};

// Função para autenticar usuário
export const authenticateUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('E-mail e senha são obrigatórios');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Senha incorreta');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, userType: user.userType },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { user, token };
};

// Função para obter usuário
export const getUser = async (email: string) => {
  if (!email) {
    throw new Error('E-mail é obrigatório');
  }

  return await prisma.user.findUnique({ where: { email } });
};

// Atualizar usuário
export const updateUser = async (
  id: string,
  data: Partial<{ name?: string; email?: string; password?: string; phone?: string; image?: string; role?: string; userType?: UserType }>
) => {
  if (!id) {
    throw new Error('ID do usuário é obrigatório');
  }

  if (data.email && !isValidEmail(data.email)) {
    throw new Error('E-mail inválido');
  }

  if (data.password && data.password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  if (data.userType && !(data.userType in UserType)) {
    throw new Error('Tipo de usuário inválido');
  }

  return await prisma.user.update({
    where: { id },
    data,
  });
};

// Excluir usuário
export const deleteUser = async (id: string) => {
  if (!id) {
    throw new Error('ID do usuário é obrigatório');
  }

  return await prisma.user.delete({ where: { id } });
};
