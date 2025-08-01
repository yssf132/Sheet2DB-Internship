import { Router } from 'express';
import upload from '../middleware/UploadMiddleware';
import { uploadFile } from '../controllers/UploadController';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/upload
router.post('/upload', authenticate, upload.single('file'), uploadFile);


export default router;
