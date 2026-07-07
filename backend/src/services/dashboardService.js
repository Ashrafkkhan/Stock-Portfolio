const portfolioService = require("./portfolioService");
const transactionModel = require("../models/transactionModel");
const watchlistModel = require("../models/watchlistModel");
const holdingModel = require("../models/holdingModel");

const getDashboard = async (userId) => {

    // Portfolio Summary using existing portfolioService
    const summary = await portfolioService.getPortfolioSummary(userId);
    const holdings = await holdingModel.getHoldingsByUser(userId);

    // Recent Transactions
    const recentTransactions =
        await transactionModel.getRecentTransactions(userId);

    // Watchlist Count
    const watchlist = await watchlistModel.getWatchlist(userId);

    return {
        totalInvestment: summary.totalInvestment,
        currentValue: summary.currentValue,
        totalProfitLoss: summary.totalProfit,
        totalProfitLossPercent: summary.returnPercentage,
        totalHoldings: holdings.length,
        watchlistCount: watchlist.length,
        recentTransactions
    };

};

module.exports = {
    getDashboard
};