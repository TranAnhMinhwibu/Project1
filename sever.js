const express = require('express');
const cors = require('cors');

// Import routes (Đảm bảo đường dẫn file đúng với thư mục bạn tạo)
const clientRoutes = require('./routesAPI/clientRoutes');
const transactionRoutes = require('./routesAPI/transactionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Cấu hình đường dẫn
// Mọi cái liên quan Client sẽ bắt đầu bằng /api/client
app.use('/api/client', clientRoutes);

// Mọi cái liên quan Giao dịch sẽ bắt đầu bằng /api/transaction
app.use('/api/transaction', transactionRoutes);

// Chạy server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});