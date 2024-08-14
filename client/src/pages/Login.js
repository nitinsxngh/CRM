import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (errors.email) {
      emailRef.current.style.setProperty('border', '1px solid rgb(209, 38, 38)', 'important');
    } else {
      emailRef.current.style.setProperty('border', '', 'important');
    }

    if (errors.password) {
      passwordRef.current.style.setProperty('border', '1px solid rgb(209, 38, 38)', 'important');
    } else {
      passwordRef.current.style.setProperty('border', '', 'important');
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'role') setRole(value);
  };

  const validateForm = () => {
    const tempErrors = {};
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Valid email is required';
      isValid = false;
    }
    if (!password) {
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
      const apiUrl = role === 'admin' 
        ? `${process.env.REACT_APP_API_BASE_URL}/admins/login` 
        : `${process.env.REACT_APP_API_BASE_URL}/user/login`;
      const response = await axios.post(apiUrl, { email, password });

      // Save token and role in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);

      if (role !== 'admin') {
        // Fetch and store user permissions
        const permissionsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/permissions/${email}`, {
          headers: { Authorization: `Bearer ${response.data.token}` }
        });
        localStorage.setItem('permissions', JSON.stringify(permissionsResponse.data.permissions));
      }

      // Redirect based on the role
      if (role === 'admin') {
        navigate('/admin');  // Adjust path as needed
      } else {
        navigate('/');
      }
    } catch (error) {
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.logo}>Vive</div>
        <div className={styles.subtitle}>
          Find the right <span className={styles.customFont}>products</span> right away
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.loginForm}>
          <h2>Login to your account</h2>
          {loginError && <p className={styles.error}>{loginError}</p>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <label htmlFor="email">Email / Phone</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Jhondoe@gmail.com"
              maxLength={50}
              value={email}
              ref={emailRef}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <label htmlFor="password">Password</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="********"
                value={password}
                ref={passwordRef}
                onChange={handleChange}
                className={errors.password ? styles.errorInput : ''}
              />
              {password.length >= 1 && (
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className={styles.showHideIcon}
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            {errors.password && <p className={styles.error}>{errors.password}</p>}

            <button type="submit" className={styles.loginButton}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
