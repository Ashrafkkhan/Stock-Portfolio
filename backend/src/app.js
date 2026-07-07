const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

module.exports = app;