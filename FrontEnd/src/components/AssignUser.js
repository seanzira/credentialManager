import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignUser = () => {
    const [username, setUsername] = useState('');
    const [divisionIds, setDivisionIds] = useState([]);  
    const [ouId, setOuId] = useState('');
    const [divisions, setDivisions] = useState([]);
    const [ous, setOus] = useState([]);

    // Fetch Divisions and OUs when the component mounts
    useEffect(() => {
        const fetchDivisionsAndOUs = async () => {
            try {
                const divisionResponse = await axios.get('http://localhost:3001/api/user-assignment/divisions');
                const ouResponse = await axios.get('http://localhost:3001/api/user-assignment/ou-list');
                setDivisions(divisionResponse.data.divisions);
                setOus(ouResponse.data.ous);
            } catch (error) {
                console.error('Error fetching divisions or OUs:', error.message);
            }
        };

        fetchDivisionsAndOUs();
    }, []);

    // Function to handle assigning the user
    const handleAssignUser = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage

            // Send the assignment request to the backend
            const response = await axios.post(
                'http://localhost:3001/api/user-assignment/assign-user',
                { username, divisionIds, ouId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message); // Display success message
            // Clear input fields after success
            setUsername('');
            setDivisionIds([]);
            setOuId('');
        } catch (error) {
            console.error('Error assigning user:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Error assigning user');
        }
    };

    return (
        <div>
            <h2>Assign User</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            {/* Multiple Division Selection */}
            <select
                multiple
                value={divisionIds}
                onChange={(e) => setDivisionIds([...e.target.selectedOptions].map(option => option.value))}
            >
                <option value="">Select Divisions</option>
                {divisions.map(division => (
                    <option key={division._id} value={division._id}>{division.name}</option>
                ))}
            </select>

            {/* OU Selection */}
            <select
                value={ouId}
                onChange={(e) => setOuId(e.target.value)}
            >
                <option value="">Select OU</option>
                {ous.map(ou => (
                    <option key={ou._id} value={ou._id}>{ou.name}</option>
                ))}
            </select>

            <button onClick={handleAssignUser}>Assign User</button>
        </div>
    );
};

export default AssignUser;
