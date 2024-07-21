const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistical.contoller');
const checkAuth = require('../middlewares/checkAuthRole'); 

router.get('/totals', checkAuth(['ADMIN', 'ROLE_STORE_KEEPER']), statisticsController.getTotals);

module.exports = router;
