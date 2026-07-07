// src/controllers/watchlistController.js

const watchlistService = require("../services/watchlistService");

// Add stock to watchlist
const addToWatchlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { symbol } = req.body;

        const result = await watchlistService.addToWatchlist(userId, symbol);

        res.status(201).json({
            success: true,
            message: "Stock added to watchlist.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Get user's watchlist
const getWatchlist = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const watchlist = await watchlistService.getWatchlist(userId);

        res.status(200).json({
            success: true,
            data: watchlist
        });
    } catch (error) {
        next(error);
    }
};

// Remove stock from watchlist
const removeFromWatchlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { symbol } = req.params;

        await watchlistService.removeFromWatchlist(userId, symbol);

        res.status(200).json({
            success: true,
            message: "Stock removed from watchlist."
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist
};