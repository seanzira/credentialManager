import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMessage } from './SetMessage';

// CreateOu component 
const CreateOU = () => {
    const { setMessage, message } = useMessage();
    const [ouName, setOuName] = useState('');
    const [divisionId, setDivisionId] = useState('');
    const [divisions, setDivisions] = useState([]);

    // useEffect hook to fetch divisions when the component mounts
    useEffect(() => {
        // Function to fetch all available divisions from the server
        const fetchDivisions = async () => {
            const token = localStorage.getItem('token'); 

            try {
                // Send GET request to fetch all divisions
                const response = await axios.get('http://localhost:3001/api/user-assignment/divisions', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDivisions(response.data.divisions); 
            } catch (error) {
                setMessage('Error fetching divisions.');
            }
        };

        fetchDivisions();
    }, []);

    // Handle form submission for creating a new OU
    const handleCreateOU = async () => {
        if (!ouName || !divisionId) {
            setMessage('OU name and Division ID are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Retrieve token

            // Send POST request to create an OU
            const response = await axios.post(
                'http://localhost:3001/api/user-assignment/create-ou',
                { ouName, divisionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Show success message
            setMessage(response.data.message);
            setOuName('');
            setDivisionId('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error creating OU');
        }
    };

    return (
        <div>
            <h2>Create New Organizational Unit (OU)</h2>
            {message && <div className="alert">{message}</div>}
            <input
                type="text"
                placeholder="OU Name"
                value={ouName}
                onChange={(e) => setOuName(e.target.value)}
            />
            <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
            >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                    <option key={division._id} value={division._id}>
                        {division.name}
                    </option>
                ))}
            </select>
            <button onClick={handleCreateOU}>Create OU</button>
        </div>
    );
};

export default CreateOU;
