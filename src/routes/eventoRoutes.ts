import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createEvento, getEventos, updateEvento, deleteEvento, getEventoById } from '../controllers/eventoController';

const router = Router();

//criar evento
router.post('/eventos', authenticateJWT, createEvento);

//obter todos eventos
router.get('/eventos', authenticateJWT, getEventos);

//obter evento especifico
router.get('/eventos/:id', authenticateJWT, getEventoById);

//atualizar evento
router.put('/eventos/:id', authenticateJWT, updateEvento);

//deletar evento
router.delete('/eventos/:id', authenticateJWT, deleteEvento);

export default router;