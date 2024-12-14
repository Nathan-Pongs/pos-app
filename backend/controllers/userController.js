const userModel = require('../models/userModel');

const loginController = async (req, res) => {
  const { email, password } = req.body; // Get email and password from request body
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    
    // Check if user exists and password matches
    if (!user) {
      return res.status(401).send({ success: false, message: 'Invalid credentials!' });
    }

    if (user.password !== password) { // Note: In production, use hashed passwords
      return res.status(401).send({ success: false, message: 'Invalid credentials!' });
    }

    res.status(200).send({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
};

const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send('User created successfully!');
  } catch (error) {
    console.log(error);
    res.status(400).send('Error creating user');
  }
};

const getAllUsersController = async (req, res) => {
  console.log("Fetching users...");
  try {
      const users = await userModel.find();
      console.log("Users fetched:", users);
      res.json(users);
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Error fetching users");
  }
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;  // Extract the ID from the request parameters
  try {
      const deletedUser = await userModel.findByIdAndDelete(id);
      if (!deletedUser) {
          return res.status(404).send({ success: false, message: 'User not found' });
      }
      res.send({ success: true, message: 'User deleted successfully', deletedUser: deletedUser });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send({ success: false, message: 'Error deleting user' });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await userModel.countDocuments();
    res.status(200).json({count});
  } catch (error) {
    res.status(500).send('Error fetching users!');
  }
}

module.exports = { loginController, registerController, getAllUsersController, deleteUserController, getUserCount };