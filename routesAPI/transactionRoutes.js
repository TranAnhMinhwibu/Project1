const express = require('express');
const router = express.Router();
const db = require('../database/db');

// API Tìm kiếm giao dịch nâng cao
// URL: http://localhost:3000/api/transaction/tim-kiem?stk=...
router.get('/tim-kiem', (req, res) => {
    // 1. Lấy tham số từ URL
    const { stk, tuNgay, denNgay, minTien, maGD } = req.query;

    // 2. SQL cơ bản (WHERE 1=1 để dễ nối chuỗi)
    let sql = "SELECT * FROM TransactionInfo WHERE 1=1"; 
    let params = [];

    // 3. Ghép điều kiện tìm kiếm (Dùng tên cột Tiếng Anh theo bảng TransactionInfo)
    
    // -- Tìm theo Mã GD
    if (maGD) {
        sql += " AND TransactionNumber LIKE ?";
        params.push(`%${maGD}%`);
    }

    // -- Tìm theo Số tài khoản (Người gửi HOẶC Người nhận)
    if (stk) {
        sql += " AND (SendNumber = ? OR ReceiveNumber = ?)";
        params.push(stk, stk);
    }

    // -- Tìm theo thời gian
    if (tuNgay) {
        sql += " AND TimeSend >= ?";
        params.push(tuNgay);
    }
    if (denNgay) {
        sql += " AND TimeSend <= ?"; 
        params.push(denNgay + ' 23:59:59'); 
    }

    // -- Tìm theo số tiền tối thiểu
    if (minTien) {
        sql += " AND MoneySend >= ?";
        params.push(minTien);
    }

    // -- Sắp xếp mới nhất trước
    sql += " ORDER BY TimeSend DESC";

    // 4. Chạy lệnh
    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// API Chuyển tiền (Placeholder)
router.post('/chuyen-tien', (req, res) => {
    res.send("Chức năng chuyển tiền đang được xây dựng...");
});

module.exports = router;