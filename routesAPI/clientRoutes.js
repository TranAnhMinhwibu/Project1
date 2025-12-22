const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Lấy danh sách tất cả khách hàng
// URL: http://localhost:3000/api/client
router.get('/', (req, res) => {
    const sql = "SELECT * FROM ClientInfo";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// Lấy chi tiết khách hàng theo Số tài khoản
// URL: http://localhost:3000/api/client/10001
router.get('/:stk', (req, res) => {
    const sql = "SELECT * FROM ClientInfo WHERE AccountNumber = ?";
    db.query(sql, [req.params.stk], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({message: "Client not found"});
        return res.json(data[0]);
    });
});

module.exports = router;