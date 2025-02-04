const express = require('express');
const {
  addCustomerController,
  getCustomerController,
  deleteCustomerController,
  getCustomerCount
} = require('../controllers/customerController');
const router = express.Router();

router.get('/get-customer', getCustomerController);
router.get('/customer-count', getCustomerCount);
router.post('/add-customer', addCustomerController);
router.delete('/delete-customer/:id', deleteCustomerController);

module.exports = router;