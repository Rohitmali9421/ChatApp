const { getUser } = require("../Services/Auth");


const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt; 
    console.log(token);
    
  if (!token) {
    return res.status(401).json({ msg: "Please login" });
  }

  const user = getUser(token); 
  if (!user) {
    return res.status(401).json({ msg: "Invalid token" });
  }

  req.user = user; 
  next(); 
};

module.exports = authenticateToken;
