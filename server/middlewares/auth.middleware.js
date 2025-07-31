import jwt from 'jsonwebtoken';

const protect = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // <== use JWT_SECRET
            if (roles.length && !roles.includes(decodedToken.role)) {
                return res.status(403).json({ message: 'Forbidden: wrong role' });
            }

            req.user = decodedToken;
            next();
        } catch (error) {
            console.error("Error in auth middleware:", error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

export default protect;
