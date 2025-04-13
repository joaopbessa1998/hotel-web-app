import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { checkAuth } from '../middlewares/checkAuth';

const router = Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// GET /auth/me
router.get('/me', checkAuth, getMe);

export default router;
