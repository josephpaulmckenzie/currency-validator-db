// File: uploadRoutes.ts
import express from 'express';
import { uploadFile } from '../controllers/uploadController';

const router = express.Router();

// Route handler for file upload
router.post('/', uploadFile);

export default router;
