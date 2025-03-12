import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSermao = async (req: any, res: any) => {
    try {
      const { title, content, date } = req.body;
      const mediaFile = req.file; // Arquivo enviado via form-data
  
      // Verifica se o userType é "LEADER"
      if (req.user.userType !== "LEADER") {
        return res.status(403).json({ message: "Only LEADER users can create sermões." });
      }
  
      // Verifica se um arquivo foi enviado
      if (!mediaFile) {
        return res.status(400).json({ message: "Media file is required." });
      }
  
      // Cria o sermão
      const sermao = await prisma.sermao.create({
        data: {
          title,
          content,
          date: new Date(date),
          mediaFile: mediaFile.path,
          userId: req.user.id,
        },
      });
  
      return res.status(201).json(sermao);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

// Obter todos os sermões
export const getSermao = async (req: any, res: any) => {
    try {
        const sermoes = await prisma.sermao.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return res.status(200).json(sermoes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

//Buscar sermão por ID
export const getSermaoById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const sermao = await prisma.sermao.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!sermao) {
      return res.status(404).json({ message: 'Sermao not found' });
    }

    return res.status(200).json(sermao);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Atualizar sermão
export const updateSermao = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, content, date } = req.body;
    const mediaFile = req.file;

    // Verifica se o usuário que está tentando atualizar é o criador ou um LEADER
    const sermao = await prisma.sermao.findUnique({
      where: { id },
    });

    if (!sermao) {
      return res.status(404).json({ message: 'Sermao not found' });
    }

    // Se o usuário não for o criador ou não for LEADER, não pode atualizar
    if (req.user.userType !== 'LEADER' && sermao.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own content or be a LEADER to update this' });
    }

    // Verifica se um arquivo foi enviado
    if (!mediaFile) {
        return res.status(400).json({ message: "Media file is required." });
    }

    // Atualiza o sermao
    const updatedSermao = await prisma.sermao.update({
      where: { id },
      data: {
        title,
        content,
        date: new Date(date),
        mediaFile: mediaFile.path
      },
    });

    return res.status(200).json(updatedSermao);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

//Apagar sermão
export const deleteSermao = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const sermao = await prisma.sermao.findUnique({
      where: { id },
    });

    if (!sermao) {
      return res.status(404).json({ message: 'Sermao not found' });
    }

    // Se o usuário não for o criador ou não for LEADER, não pode excluir
    if (req.user.userType !== 'LEADER' && sermao.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own content or be a LEADER to delete this' });
    }

    // Exclui o sermao
    await prisma.sermao.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Sermao deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
