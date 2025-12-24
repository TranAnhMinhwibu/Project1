const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.post('/account', searchController.searchByAccount);
router.post('/identity', searchController.searchBySocialID);
router.get('/transaction/:id', searchController.searchByTransactionID);

module.exports = router;