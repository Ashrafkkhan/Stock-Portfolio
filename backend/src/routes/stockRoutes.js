const express = require("express");

const router = express.Router();

const stockController = require("../controllers/stockController");

// Search stocks
// GET /api/stocks/search?q=apple
router.get("/search", stockController.searchStocks);

// Get stock details
// GET /api/stocks/AAPL
router.get("/:symbol", stockController.getStockDetails);

// Get stock history
// GET /api/stocks/AAPL/history
router.get("/:symbol/history", stockController.getStockHistory);

module.exports = router;