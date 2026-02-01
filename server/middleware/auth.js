const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, authorization denied.' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123'); // Use env var in prod
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, authorization denied.' });
    }
};

module.exports = auth;
