import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createInspiracional = async (req: any, res: any) => {
  try {
    const { title, content } = req.body;

    // Verifica se o userType é "LEADER"
    if (req.user.userType !== 'LEADER') {
        return res.status(403).json({ message: 'Only LEADER users can create inspiracional content.' });
    }      

    // Cria o inspiracional
    const inspiracional = await prisma.inspiracional.create({
      data: {
        title,
        content,
        userId: req.user.id,
      },
    });

    return res.status(201).json(inspiracional);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
