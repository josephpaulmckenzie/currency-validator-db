// File: processImageRoutes.ts
import express from 'express';
import { processImage } from '../controllers/processImageController';

const router = express.Router();

// Route handler for processing uploaded images
router.post('/', processImage);

export default router;
