const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');

router.get('/:userId', alertController.getAlerts);
router.put('/:userId', alertController.updateAlerts);

module.exports = router;
