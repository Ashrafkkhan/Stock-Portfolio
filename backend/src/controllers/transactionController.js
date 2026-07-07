const transactionService = require("../services/transactionService");

/**
 * Controller to fetch user transactions.
 * 
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, page, limit } = req.query;

        const result = await transactionService.getUserTransactions(userId, {
            type,
            page,
            limit,
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = {
    getTransactions,
};
