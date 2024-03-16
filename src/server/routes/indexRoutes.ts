// File: indexRoutes.ts
import express from 'express';
import { renderIndexPage } from '../controllers/indexController';

const router = express.Router();

// Route handler for rendering the index page
router.get('/', renderIndexPage);

export default router;
