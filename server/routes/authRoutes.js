import express from 'express';
import { registerUser, loginUser, googleCallback } from '../controllers/user/authController.js';
import passport from 'passport';

const router = express.Router();


//Login and Register Routes
router.post('/register',registerUser);
router.post('/login',loginUser);

//Google Authentication routes
// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/auth/google/callback', googleCallback);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })); 
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => { res.redirect('/dashboard'); })


export default router;

