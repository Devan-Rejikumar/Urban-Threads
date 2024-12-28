
import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { adminLogin, getAllUsers, blockUsers, unblockUsers } from '../controllers/admin/adminController.js';

const router = express.Router();

// Admin login route
router.post('/adminLogin', adminLogin);

// Protected Routes
router.get('/users', verifyToken, getAllUsers);
router.put('/users/:id/block', verifyToken, blockUsers);
router.put('/users/:id/unblock', verifyToken, unblockUsers);

export default router;


