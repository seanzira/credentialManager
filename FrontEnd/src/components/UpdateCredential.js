import React, { useState } from 'react';
import axios from 'axios';
import { useMessage } from '../components/SetMessage';

// UpdateCredential component
const UpdateCredential = () => {
    const { setMessage} = useMessage();
    const [credentialId, setCredentialId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [service, setService] = useState('');

    // function to handle updating the credential when the button is clicked
    const handleUpdateCredential = async () => {
        const token = localStorage.getItem('token');
        try {
            // sending PUT request to update the credential
            const response = await axios.put(`http://localhost:3001/api/credentials/update-credential/${credentialId}`, {
                username,
                password,
                service,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message);
            setCredentialId('');
            setUsername('');
            setPassword('');
            setService('');

            alert('Credential successfully updated');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Server error');
        }
    };

    return (
        <div>
            <h2>Update Credential</h2>
            <input type="text" placeholder="Credential ID" onChange={(e) => setCredentialId(e.target.value)} />
            <input type="text" placeholder="New Credential Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="New Credential Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="New Service" onChange={(e) => setService(e.target.value)} />
            <button onClick={handleUpdateCredential}>Update Credential</button>
        </div>
    );
};

// export UpdateCredential component to be used in other parts of the app
export default UpdateCredential;
