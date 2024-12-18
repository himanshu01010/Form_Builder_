import express from 'express';
import { createTemplate, getTemplates, deleteTemplate, updateTemplate } from '../controllers/templateController.js';

const router = express.Router();

router.post('/templates', createTemplate);
router.get('/templates', getTemplates);
router.delete('/templates/:id', deleteTemplate);
router.put('/templates/:id', updateTemplate);

export default router;
