// Import jsonwebtoken library for token verification
import jwt from 'jsonwebtoken';

// Function to verify JWT
const verifyToken = (req, res, next) => {
  console.log('Authorization Header:', req.headers['authorization']);

  // Get token from Authorization header
  const token = req.headers['authorization'];

  // If no token is provided, return a 403 Forbidden response
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  // Split the token if it contains 'Bearer <token>'
  const tokenParts = token.split(' ');

  // If token format is incorrect (not "Bearer <token>")
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(403).send({ message: 'Invalid token format.' });
  }

  // Extract the actual token (the second part of the string)
  const jwtToken = tokenParts[1];

  // Verify token using the secret key stored in environment variables
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token.' });
    }

    // Attach the decoded user information to the request
    req.user = decoded;
    next();
  });
};

// Export the verifyToken for use in other parts of the app
export default verifyToken;
