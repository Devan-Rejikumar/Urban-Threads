import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const AuthForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);

    const { firstName, lastName, email, password, confirmPassword, phone } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isSignUp && password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const url = isSignUp
                ? 'http://localhost:5000/api/auth/register'
                : 'http://localhost:5000/api/auth/login';

            const response = await axios.post(url, formData);

            if (response.status === 200 || response.status === 201) {
                setSuccess(isSignUp ? 'Registration successful!' : 'Login successful!');
                if (isSignUp) {
                    setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        phone: '',
                    });
                }
            } else {
                setError('Something went wrong.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    const handleGoogleSignUp = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                <h1 className="brand-title">Urban Threads</h1>
                <div className="form-wrapper">
                    <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <form onSubmit={handleSubmit}>
                        {isSignUp && (
                            <>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={handleChange}
                                    required
                                />
                            </>
                        )}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                        {isSignUp && (
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        )}
                        <button type="submit" className="auth-button">
                            {isSignUp ? 'Register' : 'Login'}
                        </button>
                    </form>

                    <div className="social-login">
                        <p>Or sign up using:</p>
                        <button className="social-button google-button" onClick={handleGoogleSignUp}>
                            Sign Up with Google
                        </button>
                    </div>

                    <div className="toggle-form">
                        <p>
                            {isSignUp
                                ? 'Already have an account? '
                                : "Don't have an account? "}
                            <span
                                className="toggle-link"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? 'Login here' : 'Sign Up here'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
