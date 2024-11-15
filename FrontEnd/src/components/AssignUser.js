import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignUser = () => {
    const [username, setUsername] = useState('');
    const [divisionIds, setDivisionIds] = useState([]); // Support for multiple divisions
    const [ouId, setOuId] = useState('');
    const [divisions, setDivisions] = useState([]);
    const [ous, setOus] = useState([]);

    // Fetch OUs when the component mounts
    useEffect(() => {
        const fetchOUs = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/user-assignment/ou-list');
                setOus(response.data.ous);
            } catch (error) {
                console.error('Error fetching OUs:', error.message);
            }
        };

        fetchOUs();
    }, []);

    // Fetch divisions when OU is selected
    useEffect(() => {
        if (ouId) {
            const fetchDivisions = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/user-assignment/divisions/${ouId}`);
                    setDivisions(response.data.divisions);
                } catch (error) {
                    console.error('Error fetching divisions:', error.message);
                }
            };

            fetchDivisions();
        } else {
            setDivisions([]); // Reset divisions if no OU is selected
        }
    }, [ouId]); // Run this effect when `ouId` changes

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
                {divisions.length > 0 ? (
                    divisions.map(division => (
                        <option key={division._id} value={division._id}>{division.name}</option>
                    ))
                ) : (
                    <option disabled>No divisions available</option>
                )}
            </select>

            {/* OU Selection */}
            <select
                value={ouId}
                onChange={(e) => setOuId(e.target.value)}
            >
                <option value="">Select OU</option>
                {ous.length > 0 ? (
                    ous.map(ou => (
                        <option key={ou._id} value={ou._id}>{ou.name}</option>
                    ))
                ) : (
                    <option disabled>No OUs available</option>
                )}
            </select>

            <button onClick={handleAssignUser}>Assign User</button>
        </div>
    );
};

export default AssignUser;
