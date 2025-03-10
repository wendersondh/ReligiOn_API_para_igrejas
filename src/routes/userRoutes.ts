import { Router, Request, Response } from 'express';
import { createUser, getUser, authenticateUser } from '../controllers/userController';
import { validateUser } from '../middlewares/validateUser';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Rota para criar um usuário
router.post('/users', validateUser, async (req: any, res: any) => {
  try {
    const { name, email, password, role, userType, phone, image } = req.body;

    if (!name || !email || !password || !role || !userType) {
      return res.status(400).json({ message: 'Name, email, password, role, and userType are required' });
    }

    const user = await createUser(name, email, password, role, userType, phone, image);
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Rota para login de usuário
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { user, token } = await authenticateUser(email, password);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error });
  }
});

// Rota para obter um usuário (Protegida, precisa de autenticação)
router.get('/users/:email', authenticateJWT, async (req: any, res: any) => {
  try {
    const { email } = req.params;

    const userFromToken = req.user; 

    if (!userFromToken) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await getUser(email);

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
