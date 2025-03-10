import { Router } from 'express';
import { createInspiracional } from '../controllers/inspiracionalController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Rota para criar um inspiracional
router.post('/inspiracionais', authenticateJWT, createInspiracional);

export default router;
