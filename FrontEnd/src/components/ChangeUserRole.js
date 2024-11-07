import React, { useState } from 'react';
import axios from 'axios';
import { useMessage } from './SetMessage';

// ChangeUserRole component
const ChangeUserRole = () => {
    const { setMessage } = useMessage();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('normal');

    // function to handle changing the user role
    const handleChangeUserRole = async () => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            // Sending PUT request to change the user's role
            const response = await axios.put(
                'http://localhost:3001/api/user-assignment/change-role', 
                {
                    username,  // Send username to the backend
                    newRole: role,  // Send the new role to the backend
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Attach the token for authentication
                    },
                }
            );

            // Reset form fields
            setUsername('');
            setRole('normal');

            // Notify success
            alert('User role changed successfully');
        } catch (error) {
            // Handle errors and show the message
            setMessage(error.response?.data?.message || 'Failed to change user role.');
        }
    };

    // Render the form to change a user's role
    return (
        <div>
            <h2>Change User Role</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="New Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />
            <button onClick={handleChangeUserRole}>Change Role</button>
        </div>
    );
};

// export the ChangeUserRole to be used in other parts of the app
export default ChangeUserRole;