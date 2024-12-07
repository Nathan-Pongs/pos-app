const express = require('express');
const {
    loginController,
    registerController,
    getAllUsersController,
    deleteUserController
} = require("../controllers/userController");  // Ensure the path is correct
const router = express.Router();

router.get("/get-users", getAllUsersController);  // Renamed for clarity, use GET to retrieve data
router.post("/login", loginController);
router.post("/register", registerController);
router.delete("/delete-user/:id", deleteUserController);


module.exports = router;