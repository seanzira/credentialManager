import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext'; 
import { useMessage } from '../components/SetMessage';
import { useNavigate } from 'react-router-dom'; 

// Login component
const Login = () => {
    const { login } = useAuth(); 
    const { setMessage } = useMessage(); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // function to handle login when the button is clicked
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/user/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token); // Store token
            login(); 
            alert('Login complete!');
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login unsuccessful');
        }
    };

    // rendering the login form
    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

// export the Login component to be used in other parts of the code
export default Login;
