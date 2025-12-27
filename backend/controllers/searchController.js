const db = require('../config/db');

// Tìm kiếm theo số tài khoản
exports.searchByAccount = async (req, res) => {
    try {
        const { 
            accountNumber, relatedAccount, afterTime, beforeTime, 
            minMoney, maxMoney, sendTransaction, reciveTransaction 
        } = req.body;

        const [rows] = await db.execute(
            'CALL sp_SearchByAccount(?, ?, ?, ?, ?, ?, ?, ?)',
            [accountNumber, relatedAccount || null, afterTime || null, beforeTime || null, minMoney || null, maxMoney || null, sendTransaction, reciveTransaction]
        );

        if (!rows[0] || rows[0].length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        res.json({ client: rows[0][0], transactions: rows[1] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm tài khoản' });
    }
};

// Tìm kiếm theo số CCCD
exports.searchBySocialID = async (req, res) => {
    try {
        const { 
            socialNumber, 
            relatedSocialNumber, // <--- Nhận tham số mới này
            afterTime, beforeTime, 
            minMoney, maxMoney, 
            sendTransaction, reciveTransaction 
        } = req.body;

        const [rows] = await db.execute(
            'CALL sp_SearchBySocialID(?, ?, ?, ?, ?, ?, ?, ?)',
            [
                socialNumber, 
                relatedSocialNumber || null, // Truyền CCCD liên quan vào đây
                afterTime || null, 
                beforeTime || null, 
                minMoney || null, 
                maxMoney || null, 
                sendTransaction, 
                reciveTransaction
            ]
        );

        if (!rows[0] || rows[0].length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy số CCCD hoặc không có tài khoản liên kết!' });
        }

        res.json({ client: rows[0][0], transactions: rows[1] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm CCCD' });
    }
};

// Tìm kiếm theo Mã giao dịch
exports.searchByTransactionID = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('CALL sp_SearchByTransactionID(?)', [id]);
        
        if (!rows[0] || rows[0].length === 0) {
            return res.status(404).json({ message: 'Mã giao dịch không tồn tại!' });
        }
        res.json(rows[0][0]); // Trả về object giao dịch duy nhất
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi tìm kiếm giao dịch' });
    }
};