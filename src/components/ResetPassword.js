import React, { useState } from 'react';
import { resetPassword } from './AuthService'; // Ensure the path is correct

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(email);
            setMessage('Check your email for the password reset link.');
        } catch (error) {
            console.error(error.message);
            setMessage('Failed to send password reset email.');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;
