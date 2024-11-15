import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMessage } from '../components/SetMessage';  

const ViewDivision = () => {
    const { setMessage } = useMessage();  
    const [division, setDivision] = useState(null); 
    const [credentials, setCredentials] = useState([]);  
    const [loading, setLoading] = useState(true);  

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchDivisionData = async () => {
            const token = localStorage.getItem('token');  

            // If no token is found, show message and stop further execution
            if (!token) {
                setMessage('No token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3001/api/credentials/user/division-credentials', {
                    headers: {
                        Authorization: `Bearer ${token}`,  
                    }
                });

                // Set division and credentials from the response
                if (response.data.divisionData && response.data.divisionData.length > 0) {
                    const firstDivisionData = response.data.divisionData[0];
                    setDivision(firstDivisionData.division);
                    setCredentials(firstDivisionData.credentials);
                } else {
                    setMessage('No division or credentials found.');
                }
            } catch (error) {
                setMessage(error.response?.data?.message || 'Error fetching data');
            } finally {
                setLoading(false);  // Once the data is fetched, stop loading
            }
        };

        fetchDivisionData();
    }, [setMessage]);  

    // Show loading text while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>User's Division & Credentials</h1>

            {/* Display division details */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Division Details</h2>
                {division ? (
                    <div>
                        <p><strong>Division Name: </strong>{division.name}</p>
                        <p><strong>Description: </strong>{division.description}</p>
                    </div>
                ) : (
                    <div style={{ color: 'orange' }}>No division data available.</div>
                )}
            </div>

            {/* Display the list of credentials */}
            <div>
                <h2>Credentials Associated with this Division</h2>
                {credentials.length > 0 ? (
                    <ul>
                        {credentials.map((credential) => (
                            <li key={credential._id} style={{ marginBottom: '10px' }}>
                                <div>
                                    <strong>Username: </strong>{credential.username}
                                </div>
                                <div>
                                    <strong>Service Type: </strong>{credential.service || 'Not specified'}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div style={{ color: 'gray' }}>No credentials available for this division.</div>
                )}
            </div>
        </div>
    );
};

// export ViewDivision component to be used in other parts of the code
export default ViewDivision;
