import React, { useState } from 'react';
import axios from 'axios';
import { useMessage } from './SetMessage';

// AddCredential component
const AddCredential = () => {
    const { setMessage } = useMessage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [service, setService] = useState('');

    // function to handle adding a credential
    const handleAddCredential = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3001/api/credentials/add-credentials', {
                username,
                password,
                service,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.message) {
                setMessage(response.data.message);
            }

            // Reset form fields
            setUsername('');
            setPassword('');
            setService('');

            alert('Credential successfully added!');
        } catch (error) {
            console.error('Error adding credential:', error.response?.data || error.message);
            alert('Error adding credential');
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
            <button onClick={handleAddCredential}>Add Credential</button>
        </div>
    );
};

// export AddCredential to be used in other parts of the app
export default AddCredential;
