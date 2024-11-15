import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useMessage } from '../components/SetMessage';
import { useNavigate } from 'react-router-dom';  

// Register component
const Register = () => {
    const { login } = useAuth();
    const { setMessage } = useMessage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ou, setOu] = useState('');
    const [division, setDivision] = useState('');
    const [ous, setOus] = useState([]);  
    const [divisions, setDivisions] = useState([]);  
    const navigate = useNavigate();

    // Fetch OUs when the component mounts
    useEffect(() => {
        const fetchOUs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/user-assignment/ou-list');
                console.log(response.data);
                setOus(response.data.ous);  
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error fetching OUs');
            }
        };

        fetchOUs();
    }, []);

    // Fetch divisions when OU is selected
    useEffect(() => {
        if (ou) {  // Only fetch divisions if OU is selected
            const fetchDivisions = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/user-assignment/divisions/${ou}`); 
                    console.log(response.data); 
                    setDivisions(response.data.divisions);  
                } catch (error) {
                    setMessage(error.response?.data?.message || 'Error fetching divisions');
                }
            };

            fetchDivisions();
        } else {
            setDivisions([]);  // Reset divisions if no OU is selected
        }
    }, [ou]);  // This effect runs when the selected OU changes

    // Handle registration when the button is clicked
    const handleRegister = async (e) => {
        e.preventDefault();  // Prevent form submission
        
        try {
            const response = await axios.post('http://localhost:3001/api/user/register', {
                username,
                password,
                ou, 
                division, 
            });
            
            localStorage.setItem('token', response.data.token);  // Save token to localStorage
            login();  // Set user as logged in
            setMessage(response.data.message);  // Set success message

            alert('Registration successful!');
            navigate('/login');  // Redirect to the login page after successful registration
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    // Rendering the register form
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Organizational Unit (OU):</label>
                    <select 
                        value={ou} 
                        onChange={(e) => setOu(e.target.value)} 
                        required
                    >
                        <option value="">Select an Organizational Unit</option>
                        {Array.isArray(ous) && ous.length > 0 ? (
                            ous.map((ou) => (
                                <option key={ou._id} value={ou._id}>
                                    {ou.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No OUs available</option>
                        )}
                    </select>
                </div>
                <div>
                    <label>Division:</label>
                    <select 
                        value={division} 
                        onChange={(e) => setDivision(e.target.value)} 
                        required
                    >
                        <option value="">Select a Division</option>
                        {Array.isArray(divisions) && divisions.length > 0 ? (
                            divisions.map((div) => (
                                <option key={div._id} value={div._id}>
                                    {div.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No Divisions available</option>
                        )}
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

// Export Register component to be used in other parts of the code
export default Register;
