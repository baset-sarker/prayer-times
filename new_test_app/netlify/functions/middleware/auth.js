import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY

const authenticateJWT1 = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }
      req.user = user; // Attach user info to request
      next();
    });
  } else {
    res.sendStatus(401); // No token provided
  }
};

// module.exports = authenticateJWT;
export const authenticateJWT = authenticateJWT1;
