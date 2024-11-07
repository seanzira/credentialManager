import React, { useState } from 'react';
import axios from 'axios';

// AssignUser component
const AssignUser = () => {
    const [username, setUsername] = useState('');
    const [divisionId, setDivisionId] = useState('');
    const [ouId, setOuId] = useState('');

    // Function to handle assigning the user
    const handleAssignUser = async () => {
    
        console.log("Request Body:", { username, divisionId, ouId });

        try {
            const token = localStorage.getItem('token'); 

            // Send POST request to assign the user
            const response = await axios.post(
                'http://localhost:3001/api/user-assignment/assign-user',
                {
                    username,
                    divisionId,
                    ouId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(response.data.message);  

            // Clear form fields after success
            setUsername('');
            setDivisionId('');
            setOuId('');

        } catch (error) {
            // Handle errors and log them for debugging
            console.error('Error assigning user:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Error assigning user');
        }
    };

    // rendering form for assigning user
    return (
        <div>
            <h2>Assign User</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Division ID"
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
            />
            <input
                type="text"
                placeholder="OU ID"
                value={ouId}
                onChange={(e) => setOuId(e.target.value)}
            />
            <button onClick={handleAssignUser}>Assign User</button>
        </div>
    );
};

// export AssignUser to be used in other parts of the app
export default AssignUser;
