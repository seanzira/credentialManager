import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useMessage } from '../components/SetMessage';

const UpdateCredential = () => {
    const { setMessage } = useMessage();
    
    // State variables to manage divisions, OUs, credentials, and form inputs
    const [credentials, setCredentials] = useState([]); 
    const [selectedCredentialId, setSelectedCredentialId] = useState(''); 
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [service, setService] = useState(''); 
    
    // Fetch all credentials when the component mounts
    useEffect(() => {
        const fetchCredentials = async () => {
            try {
                // Get the auth token from localStorage
                const token = localStorage.getItem('token'); 
                const response = await axios.get('http://localhost:3001/api/credentials/credentials', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Store the available credentials
                setCredentials(response.data.credentials); 
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error fetching credentials');
            }
        };

        fetchCredentials(); // Fetch credentials when component mounts
    }, [setMessage]);

    // Handle when an existing credential is selected
    const handleCredentialSelect = (e) => {

        // Find the selected credential
        const selectedCredential = credentials.find(c => c._id === e.target.value); 

        if (selectedCredential) {
            setSelectedCredentialId(selectedCredential._id); 
            setUsername(selectedCredential.username); 
            setPassword(selectedCredential.password);
            setService(selectedCredential.service);
        }
    };

    // Handle the update credential form submission
    const handleUpdateCredential = async () => {

        // Get the auth token from localStorage
        const token = localStorage.getItem('token'); 
        try {
            // Send a PUT request to update the credential
            const response = await axios.put(
                `http://localhost:3001/api/credentials/update-credential/${selectedCredentialId}`,
                {
                    username,
                    password,
                    service,
                },
                {
                    // Pass the auth token in the header
                    headers: { Authorization: `Bearer ${token}` }, 
                }
            );

            // Show an alert informing the user that the update was successful
            alert('Credential updated successfully!');
            
            // Reset the form fields if the update was successful
            setSelectedCredentialId('');
            setUsername('');
            setPassword('');
            setService('');
        } catch (error) {
            // Handle any errors during the update request
            setMessage(error.response?.data?.message || 'Error updating credential');
        }
    };

    return (
        <div>
            <h2>Update Credential</h2>

            {/* Select an existing credential from the list */}
            <select onChange={handleCredentialSelect} value={selectedCredentialId}>
                <option value="">Select Credential</option>
                {credentials.map((credential) => (
                    <option key={credential._id} value={credential._id}>
                        {/* Display credential details (username, service, division, and OU) */}
                        {`${credential.username} - ${credential.service} (${credential.division?.name || 'No Division'}, ${credential.ou?.name || 'No OU'})`}
                    </option>
                ))}
            </select>

            {/* Form to update the selected credential */}
            <input 
                type="text" 
                placeholder="New Credential Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="New Credential Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="New Service" 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
            />
            {/* Button to trigger the update action */}
            <button onClick={handleUpdateCredential}>Update Credential</button>
        </div>
    );
};

// export UpdateCredential component to be used in other parts of the app
export default UpdateCredential;
