const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');
const checkAuth = require('../middlewares/checkAuthRole');

router.get('/:userId', checkAuth({ checkUserId: true }), alertController.getAlerts);
router.put('/:userId', checkAuth({ checkUserId: true }), alertController.updateAlerts);

module.exports = router;
