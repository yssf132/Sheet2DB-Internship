import express from 'express';
import { register, login, getMe } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
