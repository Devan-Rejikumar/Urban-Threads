import express from 'express';
import { registerUser, loginUser, googleCallback } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();


//Login and Register Routes
router.post('/register',registerUser);
router.post('/login',loginUser);

//Google Authentication routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleCallback);


export default router;

