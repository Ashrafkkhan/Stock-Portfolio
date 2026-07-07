const stockService = require("../services/stockService");

// Search Stocks
const searchStocks = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const stocks = await stockService.searchStocks(q);

        return res.status(200).json({
            success: true,
            data: stocks,
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

// Get Current Stock Details
const getStockDetails = async (req, res) => {
    try {
        const { symbol } = req.params;

        const stock = await stockService.getStockDetails(symbol);

        return res.status(200).json({
            success: true,
            data: stock,
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

// Get Stock History
const getStockHistory = async (req, res) => {
    try {
        const { symbol } = req.params;

        const history = await stockService.getStockHistory(symbol);

        return res.status(200).json({
            success: true,
            data: history,
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = {
    searchStocks,
    getStockDetails,
    getStockHistory,
};