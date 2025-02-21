const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET_CODE;
function setUser(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    secret,
    {
      expiresIn:"15d"
    }
  );
  
}
function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
