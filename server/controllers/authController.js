import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const registerUser = async (req, res) => {
    console.log('Request received at /register'); // Debug Log
    console.log('Request Body:', req.body); // Log Incoming Data
    try {
        const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
            console.log(1)
            return res.status(400).json({ message: 'Please fill in all fields' });
            
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }


        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

  
        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
        });

   
        await newUser.save();

      
        const payload = { id: newUser._id, email: newUser.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastname: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

    
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastname,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const googleCallback = (req,res) =>{
    passport.authenticate('google',{failureRedirect : '/login'},(err, user, info) => {
        if(err || !user){
            return res.redirect('/login?error=Google Authentication Failed');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect('http://localhost:3000/dashboard');

    })(req,res)
}

export { registerUser, loginUser, googleCallback };
