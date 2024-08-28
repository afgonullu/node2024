import express from 'express';
import adminRouter from './admin';

const router = express.Router();

// Admin API (protected, except for login)
router.use('/api/admin', adminRouter);

export default router;
