import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: function() {
            return !this.googleId; // Phone is not required for Google sign-in
        }
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is not required for Google sign-in
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status : {
        type : String,
        enum : ['active', 'blocked'], default : 'active'
    },
});

const User = mongoose.model('User', userSchema);

export default User;

