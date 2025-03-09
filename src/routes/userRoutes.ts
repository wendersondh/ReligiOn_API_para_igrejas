import { Router, Request, Response } from 'express';
import { createUser, getUser } from '../controllers/userController';
import { validateUser } from '../middlewares/validateUser';

const router = Router();

router.post('/users', validateUser, async (req: Request, res: any) => {
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

router.get('/users/:email', async (req: Request, res: any) => {
  try {
    const { email } = req.params;
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
