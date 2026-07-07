const express = require("express");

const router = express.Router();

const portfolioController = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all holdings of the user
// GET /api/portfolio
router.get(
    "/",
    authMiddleware,
    portfolioController.getHoldings
);

// Get portfolio summary of the user
// GET /api/portfolio/summary
router.get(
    "/summary",
    authMiddleware,
    portfolioController.getSummary
);

module.exports = router;
