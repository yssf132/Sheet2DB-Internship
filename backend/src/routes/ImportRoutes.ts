import { Router } from 'express';
import { validateAndImport } from '../controllers/ImportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/validate-and-import', authenticate, validateAndImport);

export default router;