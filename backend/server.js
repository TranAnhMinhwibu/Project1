const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/searchRoutes');
require('dotenv').config();

const app = express();

app.use(cors()); // Cho phép frontend gọi API
app.use(express.json());

// Routes
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 3000;
// Thêm '0.0.0.0' vào tham số thứ 2
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});