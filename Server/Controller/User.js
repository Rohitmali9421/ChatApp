const bcrypt = require("bcrypt");
const User = require("../Models/User");
const { setUser, getUser } = require("../Services/Auth");
const {
  uploadOnCloudinary,
  deleteOnCloudinary,
} = require("../Services/Choudinary");

const handlesignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const accessToken = setUser(newUser);
    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.cookie("jwt", accessToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true, 
      secure: true, 
      sameSite: "None",
    });
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const accessToken = setUser(user);
    const { password: _, ...userWithoutPassword } = user._doc;
    res.cookie("jwt", accessToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true, 
      secure: true, 
      sameSite: "None",
    });
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ msg: "log out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

const handleGetUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(filteredUsers);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};
const handleGetUser = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        error: "Authentication token is missing or invalid.",
      });
    }

    const decoded = getUser(token);

    const user = await User.findOne({ _id: decoded.id }).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);

    return res.status(500).json({
      error: "Server error. Please try again later.",
    });
  }
};
const handleEditUser = async (req, res) => {
  try {
    const { name } = req.body;
    let imagePath = req.body.imagePath;

    // Fetch the existing user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let profilePic = user.profilePic; // Keep the old image if no new image is provided

    if (imagePath) {
      // If a new image is provided, delete the old image from Cloudinary
      if (user.profilePic && user.profilePic.public_id) {
        await deleteOnCloudinary(user.profilePic.public_id);
      }

      // Upload the new image to Cloudinary
      profilePic = await uploadOnCloudinary(imagePath);
    }

    // Update the user's profile with new data
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, profilePic },
      { new: true } // Return the updated user
    );
    const { password: _, ...userWithoutPassword } = updatedUser._doc;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error Editing user:", error.message);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
};

module.exports = {
  handlesignUp,
  handleLogin,
  logout,
  handleGetUsers,
  handleGetUser,
  handleEditUser,
};
