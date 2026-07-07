const transactionModel = require("../models/transactionModel");

/**
 * Helper function to format transaction_time as YYYY-MM-DD
 * 
 * @param {Date|string} dateVal - The date value to format.
 * @returns {string} Formatted date.
 */
const formatDate = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get filtered and/or paginated transactions for a user.
 * 
 * @param {number} userId - The user ID.
 * @param {object} queryParams - Filters including type, page, and limit.
 * @returns {Promise<object>} The transactions result.
 */
const getUserTransactions = async (userId, queryParams = {}) => {
    const { type, page, limit } = queryParams;

    // Map database rows to the camelCase response schema
    const mapRows = (rows) => rows.map((row) => ({
        id: row.id,
        symbol: row.symbol,
        type: row.transaction_type,
        quantity: Number(row.quantity),
        price: parseFloat(Number(row.price).toFixed(2)),
        totalAmount: parseFloat(Number(row.total_amount).toFixed(2)),
        date: formatDate(row.transaction_time),
    }));

    if (page || limit) {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;

        const [rows, total] = await Promise.all([
            transactionModel.getTransactions(userId, { type, page: pageNum, limit: limitNum }),
            transactionModel.getTransactionsCount(userId, { type }),
        ]);

        return {
            page: pageNum,
            limit: limitNum,
            total,
            transactions: mapRows(rows),
        };
    } else {
        const rows = await transactionModel.getTransactions(userId, { type });

        return {
            transactions: mapRows(rows),
        };
    }
};

module.exports = {
    getUserTransactions,
};
