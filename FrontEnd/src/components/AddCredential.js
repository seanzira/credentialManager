import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMessage } from './SetMessage';

// AddCredential component
const AddCredential = () => {
    const { setMessage } = useMessage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [service, setService] = useState('');
    const [division, setDivision] = useState('');
    const [ou, setOu] = useState('');  
    const [divisions, setDivisions] = useState([]);  
    const [ous, setOus] = useState([]); 

    // Fetch OUs when the component mounts
    useEffect(() => {
        const fetchOUs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/user-assignment/ou-list');
                if (Array.isArray(response.data.ous)) {
                    setOus(response.data.ous); 
                } else {
                    setOus([]);
                    console.error('Received data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching OUs:', error);
            }
        };

        fetchOUs();
    }, []); // Only fetch OUs once on mount

    // Fetch divisions when the selected OU changes
    useEffect(() => {
        const fetchDivisions = async () => {
            if (!ou) {
                setDivisions([]); // Reset divisions if no OU is selected
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/api/user-assignment/divisions/${ou}`);
                if (Array.isArray(response.data.divisions)) {
                    setDivisions(response.data.divisions); 
                } else {
                    setDivisions([]);
                    console.error('Received data is not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching divisions:', error);
            }
        };

        fetchDivisions();
    }, [ou]); // This effect runs whenever the OU changes

    // Handle the addition of a credential
    const handleAddCredential = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('You need to be logged in!');
            return;
        }

        // Ensuring that the OU and division are selected
        if (!ou || !division || !username || !password || !service) {
            alert('Please fill all fields!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/credentials/add-credentials', {
                username,
                password,
                service,
                division,
                ou, 
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Display success message
            if (response.data.message) {
                setMessage(response.data.message);
            }

            // Reset form fields
            setUsername('');
            setPassword('');
            setService('');
            setDivision('');
            setOu('');

            alert('Credential successfully added!');
        } catch (error) {
            console.error('Error adding credential:', error.response ? error.response.data : error.message);
            const errorMessage = error.response?.data?.message || 'An error occurred while adding the credential.';
            alert(errorMessage);
        }
    };

    // rendering the form to add a credential
    return (
        <div>
            <h2>Add Credential</h2>
            <input 
                type="text" 
                placeholder="Credential Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Credential Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Service" 
                value={service}
                onChange={(e) => setService(e.target.value)} 
            />
            <select 
                value={division} 
                onChange={(e) => setDivision(e.target.value)}
            >
                <option value="">Select Division</option>
                {Array.isArray(divisions) && divisions.length > 0 ? (
                    divisions.map((div) => (
                        <option key={div._id} value={div._id}>{div.name}</option>
                    ))
                ) : (
                    <option disabled>No Divisions available</option>
                )}
            </select>
            <select 
                value={ou} 
                onChange={(e) => setOu(e.target.value)}
            >
                <option value="">Select Organizational Unit (OU)</option>
                {Array.isArray(ous) && ous.length > 0 ? (
                    ous.map((ou) => (
                        <option key={ou._id} value={ou._id}>{ou.name}</option>
                    ))
                ) : (
                    <option disabled>No Organizational Units available</option>
                )}
            </select>
            <button onClick={handleAddCredential}>Add Credential</button>
        </div>
    );
};

// export the component to be used in other parts of the code
export default AddCredential;
