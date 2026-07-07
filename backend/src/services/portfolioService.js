const holdingModel = require("../models/holdingModel");
const stockService = require("./stockService");

/**
 * Get detailed holdings for a user.
 * 
 * @param {number} userId - The user ID.
 * @returns {Promise<Array>} The detailed holdings list.
 */
const getUserHoldings = async (userId) => {
    const holdings = await holdingModel.getHoldingsByUser(userId);

    const detailedHoldings = await Promise.all(
        holdings.map(async (holding) => {
            const details = await stockService.getStockDetails(holding.symbol);
            const currentPrice = Number(details.price);
            const quantity = Number(holding.quantity);
            const averageBuyPrice = Number(holding.average_buy_price);

            const currentValue = quantity * currentPrice;
            const investedAmount = quantity * averageBuyPrice;
            const profitLoss = currentValue - investedAmount;

            return {
                symbol: holding.symbol,
                quantity,
                averageBuyPrice: parseFloat(averageBuyPrice.toFixed(2)),
                currentPrice: parseFloat(currentPrice.toFixed(2)),
                currentValue: parseFloat(currentValue.toFixed(2)),
                profitLoss: parseFloat(profitLoss.toFixed(2)),
            };
        })
    );

    return detailedHoldings;
};

/**
 * Get portfolio summary for a user.
 * 
 * @param {number} userId - The user ID.
 * @returns {Promise<object>} The portfolio summary.
 */
const getPortfolioSummary = async (userId) => {
    const holdings = await getUserHoldings(userId);

    let totalInvestment = 0;
    let currentValue = 0;

    holdings.forEach((holding) => {
        const investedAmount = holding.quantity * holding.averageBuyPrice;
        totalInvestment += investedAmount;
        currentValue += holding.currentValue;
    });

    let totalProfit = currentValue - totalInvestment;
    if (Math.abs(totalProfit) < 0.01) {
        totalProfit = 0;
    }

    let returnPercentage = 0;
    if (totalInvestment > 0) {
        returnPercentage = (totalProfit / totalInvestment) * 100;
    }
    if (Math.abs(returnPercentage) < 0.01) {
        returnPercentage = 0;
    }

    return {
        totalInvestment: parseFloat(totalInvestment.toFixed(2)),
        currentValue: parseFloat(currentValue.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        returnPercentage: parseFloat(returnPercentage.toFixed(2)),
    };
};

module.exports = {
    getUserHoldings,
    getPortfolioSummary,
};
