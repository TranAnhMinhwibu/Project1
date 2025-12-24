const mysql = require('mysql2');
const path = require('path');

// Chỉ định rõ đường dẫn tới file .env nằm ở thư mục cha (backend/)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// In ra log để kiểm tra xem đã đọc được chưa (Debug)
console.log('--- DB CONNECTION INFO ---');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER); // Nếu cái này hiện undefined là lỗi
console.log('DB_NAME:', process.env.DB_NAME);
console.log('--------------------------');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

module.exports = pool.promise();