import { Router } from 'express';
import upload from '../middleware/UploadMiddleware';
import { uploadFile } from '../controllers/UploadController';

const router = Router();

// POST /api/upload
router.post('/upload', upload.single('file'), uploadFile);


export default router;
