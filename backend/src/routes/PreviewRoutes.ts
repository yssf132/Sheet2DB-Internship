import { Router } from 'express';
import { previewFile } from '../controllers/PreviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/preview/:fileId', authenticate, previewFile);


export default router ;