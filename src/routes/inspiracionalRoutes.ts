import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createInspiracional, getInspiracionais, getInspiracionalById, updateInspiracional, deleteInspiracional } from '../controllers/inspiracionalController';

const router = Router();

// Criar um inspiracional
router.post('/inspiracionais', authenticateJWT, createInspiracional);

// Obter todos
router.get('/inspiracionais', authenticateJWT, getInspiracionais);

//  Inspiracional específico
router.get('/inspiracionais/:id', authenticateJWT, getInspiracionalById);

// Atualizar inspiracional
router.put('/inspiracionais/:id', authenticateJWT, updateInspiracional);

// Excluir inspiracional
router.delete('/inspiracionais/:id', authenticateJWT, deleteInspiracional);

export default router;
