import express from 'express';
import { getForm, saveForm, deleteForm,deletePage } from '../controllers/formController.js';

const router = express.Router();

router.get('/forms/:templateId', getForm);
router.post('/forms/:templateId', saveForm);
router.delete('/forms/:templateId', deleteForm);
router.put("/forms/:templateId/delete-page", deletePage);

export default router;
