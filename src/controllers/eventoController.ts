import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//criar evento
export const createEvento = async (req: any, res: any) => {
    try {
        const { title, description, publico, date, latitude, longitude} = req.body;

        // Verifica se o userType é "LEADER"
        if (req.user.userType !== 'LEADER') {
        return res.status(403).json({ message: 'Only LEADER users can create events.' });
        }

        if (!title || !description || !publico || !date || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const evento = await prisma.evento.create({
            data: {
                title,
                description,
                publico,
                date: new Date(date),
                latitude,
                longitude,
                userId: req.user.id
            },
        });
        return res.status(201).json(evento);

    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro: evento não criado' });
    }
}

//listar eventos
export const getEventos = async (req: any, res: any) => {
    try {
        const eventos = await prisma.evento.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            
        });

        return res.status(200).json(eventos.length ? eventos : { message: 'No events found.' });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong while fetching events.' });
    }
}

//buscar evento por id
export const getEventoById = async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const evento = await prisma.evento.findUnique({
            where: {id},
            include: {
                user:{
                    select: {
                        name: true,
                    }
                }
            }
        });

        if (!evento){
            return res.status(404).json({ message: 'Event not found.' });
        }

        return res.status(200).json(evento);
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong while fetching the event.' });
    }
}

//atualizar evento
export const updateEvento = async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const { title, description, publico, date, latitude, longitude } = req.body;

        // Verifica se o userType é "LEADER"
        if (req.user.userType !== 'LEADER') {
        return res.status(403).json({ message: 'Only LEADER users can update events.' });
        }

        if (!title || !description || !publico || !date || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const evento = await prisma.evento.update({
            where: { id },
            data: {
                title,
                description,
                publico,
                date: new Date(date),
                latitude,
                longitude,
            },
        });

        return res.status(200).json(evento);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong while updating the event.' });
    }

}

//deletar evento
export const deleteEvento = async (req: any, res: any) => {
    try {
        const id = req.params.id;

        // Verifica se o userType é "LEADER"
        if(req.user.userType !== 'LEADER'){
            return res.status(403).json({ message: 'Only LEADER users can delete events.' });
        }

        const evento = await prisma.evento.findUnique({
            where: { id }
        });

        if(!evento){
            return res.status(404).json({ message: 'Event not found.' });
        }

        await prisma.evento.delete({
            where: {id},
        });

        return res.status(200).json({ message: 'Event deleted successfully.', evento });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong while deleting the event.' });
    }
}

