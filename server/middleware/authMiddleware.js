import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired' });
        }
        return res.status(400).json({ message: 'Invalid token' });
    }
};

export default verifyToken;
