const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.post('/', vendorController.createVendor);
router.get('/', vendorController.getAllVendors);
router.put('/:id', vendorController.updateVendor);

module.exports = router;
