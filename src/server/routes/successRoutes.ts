// File: successRoutes.ts
import express from 'express';
import { renderSuccessPage } from '../controllers/successController';

const router = express.Router();

// Route handler for rendering the success page
router.get('/', renderSuccessPage);

export default router;
