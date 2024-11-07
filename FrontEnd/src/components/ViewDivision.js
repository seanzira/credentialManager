import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMessage } from '../components/SetMessage';  

const ViewDivision = () => {
    const { setMessage } = useMessage();  
    const [division, setDivision] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the division for the logged-in user
        const fetchDivision = async () => {
            // Get the token from localStorage
            const token = localStorage.getItem('token');  

            if (!token) {
                setMessage('No token found. Please log in.');
                return;
            }

            try {
                // Fetch division data from the backend
                const response = await axios.get(
                    'http://localhost:3001/api/credentials/division',  
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,  
                        },
                    }
                );

                // Set the division data
                if (response.data && response.data.division) {
                    setDivision(response.data.division);
                } else {
                    setMessage('No division found for the logged-in user.');
                }
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error fetching division data');
            } finally {
                setLoading(false);
            }
        };

        fetchDivision();
    }, [setMessage]);  // Effect will run on mount

    // Show loading message while data is being fetched
    if (loading) {
        return <div>Loading division...</div>;
    }

    // Render the division details if available
    return (
        <div>
            <h2>Division Details</h2>
            {division ? (
                <div>
                    <h3>{division.name}</h3>
                    <p>{division.description}</p>
                </div>
            ) : (
                <p>No division data available.</p>
            )}
        </div>
    );
};

export default ViewDivision;
