const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied: No token provided");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (e) {
    res.status(400).send("Invalid token");
  }
}

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Access token missing or invalid" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the same secret as when signing the token
//     req.user = decoded; // Attach the decoded user info to the request
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send("Access Denied:Insufficient Permissions");
    }

    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
