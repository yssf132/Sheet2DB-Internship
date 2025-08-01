import { Router } from 'express';
import { validateAndImport } from '../controllers/ImportController';

const router = Router();

router.post('/validate-and-import', validateAndImport);

export default router;