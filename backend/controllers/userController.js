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

module.exports = { loginController, registerController };