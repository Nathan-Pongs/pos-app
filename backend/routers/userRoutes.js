const express = require('express');
const {
    loginController,
    registerController,
    getAllUsersController,
    deleteUserController,
    getUserCount
} = require("../controllers/userController");  // Ensure the path is correct
const router = express.Router();

router.get("/get-users", getAllUsersController);
router.get("/user-count", getUserCount);
router.post("/login", loginController);
router.post("/register", registerController);
router.delete("/delete-user/:id", deleteUserController);

module.exports = router;