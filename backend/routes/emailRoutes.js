const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/inbound', emailController.handleInboundEmail);

module.exports = router;
