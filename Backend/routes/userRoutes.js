const { createUser, loginUser, updateUser, deleteUser } = require("../controllers/userContoller");
const {protect} = require("../middleware/authMiddleware")
const User = require("../models/userModel"); // Ensure the correct path


const express = require("express")


const Router = express.Router();

Router.route("/create").post(createUser);
Router.route("/login").post(loginUser);
Router.put("/update", protect, updateUser);  // Protected route for updating user
Router.delete("/delete", protect, deleteUser);

Router.get("/profile", protect, async (req, res) => {
    try {
      console.log("User ID:", req.user?.id); // Log User ID
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized - No User ID" });
      }
  
      const user = await User.findById(req.user.id).select("-password");
      console.log("User Found:", user);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, user });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
  

module.exports = Router