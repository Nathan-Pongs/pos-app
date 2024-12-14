const express = require('express');
const {
  addBillController,
  getBillController,
  deleteBillController,
  billCountController,
  getBillCount
} = require('../controllers/billController');
const router = express.Router();

router.get('/get-bill', getBillController);
router.get('/bill-count', getBillCount);
router.post('/add-bill', addBillController);
router.get('/count', billCountController);
router.delete('/delete-bill/:id', deleteBillController);

module.exports = router;