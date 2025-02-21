const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
const token = req.header('Authorization');

  // Check if token is provided
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Remove the 'Bearer ' prefix
    const actualToken = token.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Find the user by the decoded userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid', error });
  }
};
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Accès non autorisé, utilisateur non authentifié" });
  }
  console.log("Utilisateur authentifié :", req.user);
  next();
};

module.exports = authMiddleware;
