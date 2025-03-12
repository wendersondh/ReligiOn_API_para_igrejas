import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createSermao, deleteSermao, getSermao, getSermaoById, updateSermao } from '../controllers/sermaoController';
import upload from '../middlewares/uploadMiddleware';
const router = Router();

// Criar um sermao
router.post('/sermao', authenticateJWT, upload.single("mediaFile"), createSermao);

// Obter todos
router.get('/sermao', authenticateJWT, getSermao);

// Sermao específico
router.get('/sermao/:id', authenticateJWT, getSermaoById);

// Atualizar sermao
router.put('/sermao/:id', authenticateJWT, upload.single("mediaFile"), updateSermao);

// Excluir sermao
router.delete('/sermao/:id', authenticateJWT, deleteSermao);

export default router;
