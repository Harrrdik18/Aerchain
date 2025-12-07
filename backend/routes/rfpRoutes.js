const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

router.post('/generate-from-text', rfpController.createRFP); // Generates JSON
router.post('/', rfpController.saveRFP); // Saves the JSON
router.get('/', rfpController.getAllRFPs);
router.get('/:id', rfpController.getRFP);
router.post('/:id/send-to-vendors', rfpController.sendRFPToVendors);
router.get('/:id/comparison', rfpController.getComparison);

module.exports = router;
