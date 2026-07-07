console.log("✅ app.js loaded");
const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
console.log("✅ watchlistRoutes imported");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Database Test Route
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "Database Connected",
            serverTime: result.rows[0].now,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Stock Routes
app.use("/api/stocks", stockRoutes);

// Trade Routes
app.use("/api/trade", tradeRoutes);

// Portfolio Routes
app.use("/api/portfolio", portfolioRoutes);

// Transaction Routes
app.use("/api/transactions", transactionRoutes);

// Watchlist Routes
app.use("/api/watchlist", watchlistRoutes);

module.exports = app;