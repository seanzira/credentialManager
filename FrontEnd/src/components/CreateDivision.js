import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMessage } from './SetMessage';

const CreateDivision = () => {
    const { setMessage, message } = useMessage();
    const [divisionName, setDivisionName] = useState('');
    const [description, setDescription] = useState('');
    const [ouId, setOuId] = useState(''); // State to hold the selected OU ID
    const [ous, setOus] = useState([]); // State to store the list of OUs

    // Fetch OUs (Organizational Units) on component mount
    useEffect(() => {
        const fetchOUs = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3001/api/user-assignment/ou-list', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOus(response.data.ous); // Store the OUs in state
            } catch (error) {
                setMessage('Error fetching OUs.');
            }
        };

        fetchOUs();
    }, []);

    // Handle form submission for creating a new division
    const handleCreateDivision = async () => {
        if (!divisionName || !description || !ouId) {
            setMessage('Division name, description, and OU are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage

            // Send POST request to create a division, including the selected OU
            const response = await axios.post(
                'http://localhost:3001/api/user-assignment/create-division',
                { divisionName, description, ou: ouId }, // Include 'ou' in the request body
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);
            setDivisionName('');
            setDescription('');
            setOuId(''); // Clear selected OU after submission
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error creating division');
        }
    };

    return (
        <div>
            <h2>Create New Division</h2>
            {message && <div className="alert">{message}</div>}
            <input
                type="text"
                placeholder="Division Name"
                value={divisionName}
                onChange={(e) => setDivisionName(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <select
                value={ouId}
                onChange={(e) => setOuId(e.target.value)} // Update the selected OU ID
            >
                <option value="">Select Organizational Unit (OU)</option>
                {ous.map((ou) => (
                    <option key={ou._id} value={ou._id}>
                        {ou.name}
                    </option>
                ))}
            </select>
            <button onClick={handleCreateDivision}>Create Division</button>
        </div>
    );
};

// export CreateDivision to be used in other parts of this app
export default CreateDivision;
