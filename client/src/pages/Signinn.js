import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Signinn.module.css'; // Import your CSS module for styling

const UserLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate(); // Use navigate instead of useHistory

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const tempErrors = {};
        let isValid = true;

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Valid email is required';
            isValid = false;
        }
        if (!formData.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:3002/api/user/login', formData);
            // Handle successful login (e.g., redirect or save token)
            console.log('Login successful:', response.data);

            // Redirect to the home page upon successful login
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2>User Login</h2>
            {loginError && <div className={styles.loginError}>{loginError}</div>}
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? styles.errorInput : ''}
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
                
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.errorInput : ''}
                />
                {errors.password && <p className={styles.error}>{errors.password}</p>}
                
                <button type="submit" className={styles.loginButton}>Login</button>
            </form>
        </div>
    );
};

export default UserLoginPage;
