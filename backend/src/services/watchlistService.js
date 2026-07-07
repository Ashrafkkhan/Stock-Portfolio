const watchlistModel = require("../models/watchlistModel");
const stockService = require("./stockService");

// Add stock
const addToWatchlist = async (userId, symbol) => {

    symbol = symbol.toUpperCase();

    // Check duplicate
    const existing = await watchlistModel.findBySymbol(userId, symbol);

    if (existing) {
        throw new Error("Stock already exists in watchlist.");
    }

    // Verify stock exists
    const company = await stockService.getCompanyProfile(symbol);

    if (!company || !company.name) {
        throw new Error("Invalid stock symbol.");
    }

    return await watchlistModel.addStock(
        userId,
        symbol,
        company.name
    );
};

// Get watchlist
const getWatchlist = async (userId) => {

    const stocks = await watchlistModel.getWatchlist(userId);

    const watchlist = await Promise.all(
        stocks.map(async (stock) => {

            const quote = await stockService.getQuote(stock.symbol);

            return {
                id: stock.id,
                symbol: stock.symbol,
                companyName: stock.company_name,
                currentPrice: quote.currentPrice,
                addedAt: stock.added_at
            };
        })
    );

    return watchlist;
};

// Remove stock
const removeFromWatchlist = async (userId, symbol) => {

    symbol = symbol.toUpperCase();

    const removed = await watchlistModel.removeStock(userId, symbol);

    if (!removed) {
        throw new Error("Stock not found in watchlist.");
    }

    return removed;
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist,
};