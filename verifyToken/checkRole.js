import User from "../models/User.js";

// Middleware to check user role
const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        const userId = req.user.id;

        try {
            // Find the user based on their ID
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // If the user is an admin, they have permission to do anything
            if (user.role === 'admin') {
                return next();
            }

            // Define the role hierarchy (normal < management < admin)
            const rolesHierarchy = ['normal', 'management', 'admin'];
            const userRoleIndex = rolesHierarchy.indexOf(user.role);
            const requiredRoleIndex = rolesHierarchy.indexOf(requiredRole);

            // If the user role is less than the required role, deny access
            if (userRoleIndex < requiredRoleIndex) {
                return res.status(403).json({ message: 'Permission denied: Insufficient role' });
            }

            // If the user's role meets or exceeds the required role, allow access
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};

export default checkRole;
