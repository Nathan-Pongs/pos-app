const express = require('express');
const {
  addBillController,
  getBillController,
  deleteBillController
} = require('../controllers/billController');
const router = express.Router();

router.get('/get-bill', getBillController);
router.post('/add-bill', addBillController);
router.delete('/delete-bill/:id', deleteBillController);

module.exports = router;