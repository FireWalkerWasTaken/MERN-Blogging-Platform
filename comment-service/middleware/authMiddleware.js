import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided in headers:", req.headers);
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Extract user ID from the token and make it available in both sub and id fields
    req.user = {
      id: decoded.sub || decoded.id, // support both formats
      sub: decoded.sub || decoded.id, // support both formats
      roles: decoded.roles,
      type: decoded.type
    };
    console.log("Successfully authenticated user with ID:", req.user.id);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
