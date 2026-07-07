const portfolioService = require("../services/portfolioService");

/**
 * Controller to fetch all user holdings.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getHoldings = async (req, res) => {
    try {
        const userId = req.user.id;
        const holdings = await portfolioService.getUserHoldings(userId);

        return res.status(200).json({
            holdings,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

/**
 * Controller to fetch user portfolio summary.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const summary = await portfolioService.getPortfolioSummary(userId);

        return res.status(200).json(summary);
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = {
    getHoldings,
    getSummary,
};
