import { Router } from 'express';
import { previewFile } from '../controllers/PreviewController';

const router = Router();

router.get('/preview/:fileId', previewFile);


export default router ;