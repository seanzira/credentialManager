import React from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { AuthProvider, useAuth } from './components/AuthContext';
import { MessageProvider } from './components/SetMessage';
import Register from './components/Register';
import Login from './components/Login';
import AddCredential from './components/AddCredential';
import UpdateCredential from './components/UpdateCredential';
import AssignUser from './components/AssignUser';
import ViewDivision from './components/ViewDivision';
import ChangeUserRole from './components/ChangeUserRole';
import CreateDivision from './components/CreateDivision';
import CreateOU from './components/CreateOu';

// Protecting routes that require authentication
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <div>Please log in to access this page.</div>;
};

const App = () => {
  return (
    <AuthProvider>
      <MessageProvider>
        <Router>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>User Authentication</h1>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/add-credential" element={<ProtectedRoute element={<AddCredential />} />} />
              <Route path="/update-credential" element={<ProtectedRoute element={<UpdateCredential />} />} />
              <Route path="/assign-user" element={<ProtectedRoute element={<AssignUser />} />} />
              <Route path="/division" element={<ProtectedRoute element={<ViewDivision />} />} />
              <Route path="/change-role" element={<ProtectedRoute element={<ChangeUserRole />} />} />
              <Route path="/create-ou" element={<ProtectedRoute element={<CreateOU />} />} />
              <Route path="/create-division" element={<ProtectedRoute element={<CreateDivision />} />} />
            </Routes>
          </div>
        </Router>
      </MessageProvider>
    </AuthProvider>
  );
};

// exporting the app component for use in other files
export default App;
