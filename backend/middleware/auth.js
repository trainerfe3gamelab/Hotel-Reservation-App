import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId; 

    if (decoded.exp <= Date.now() / 1000) {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;