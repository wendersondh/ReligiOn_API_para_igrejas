import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Criar inspiracional
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

// Obter todos
export const getInspiracionais = async (req: any, res: any) => {
    try {
      const inspiracionais = await prisma.inspiracional.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
  
      return res.status(200).json(inspiracionais);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  };
  

// Inspiracional específico pelo id
export const getInspiracionalById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const inspiracional = await prisma.inspiracional.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!inspiracional) {
      return res.status(404).json({ message: 'Inspiracional not found' });
    }

    return res.status(200).json(inspiracional);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Atualizar inspiracional
export const updateInspiracional = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Verifica se o usuário que está tentando atualizar é o criador ou um LEADER
    const inspiracional = await prisma.inspiracional.findUnique({
      where: { id },
    });

    if (!inspiracional) {
      return res.status(404).json({ message: 'Inspiracional not found' });
    }

    // Se o usuário não for o criador ou não for LEADER, não pode atualizar
    if (req.user.userType !== 'LEADER' && inspiracional.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own content or be a LEADER to update this' });
    }

    // Atualiza o inspiracional
    const updatedInspiracional = await prisma.inspiracional.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json(updatedInspiracional);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Excluir um inspiracional
export const deleteInspiracional = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const inspiracional = await prisma.inspiracional.findUnique({
      where: { id },
    });

    if (!inspiracional) {
      return res.status(404).json({ message: 'Inspiracional not found' });
    }

    // Se o usuário não for o criador ou não for LEADER, não pode excluir
    if (req.user.userType !== 'LEADER' && inspiracional.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own content or be a LEADER to delete this' });
    }

    // Exclui o inspiracional
    await prisma.inspiracional.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Inspiracional deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
