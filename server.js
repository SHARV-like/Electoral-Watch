require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./server/config/db');
const path = require('path');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://electoral-watch-dashboard.onrender.com'], // Replace with your exact frontend Render URL
    credentials: true 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Make 'uploads' folder statically addressable for client images fetching
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/complaints', require('./server/routes/complaintRoutes'));

// Basic Test Route (Root)
app.get('/', (req, res) => {
    res.json({ message: 'Electoral Malpractice Reporting API is running...' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
