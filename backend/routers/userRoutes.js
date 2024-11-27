const express = require('express');
const {
    loginController,
    registerController
} = require("./../controllers/userController");
const router = express.Router();

// Change GET to POST for login
router.post("/login", loginController); // Update this line to POST
router.post("/register", registerController);

module.exports = router;