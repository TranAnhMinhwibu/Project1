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
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});