import express from "express";
import { submitForm } from "../controllers/formSubmissionController.js";

const router = express.Router();

router.post("/forms/:templateId/submit", submitForm);

export default router;
