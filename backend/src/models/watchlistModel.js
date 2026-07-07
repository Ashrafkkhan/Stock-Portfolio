const pool = require("../config/db");

// Check if stock already exists
const findBySymbol = async (userId, symbol) => {
    const query = `
        SELECT *
        FROM watchlist
        WHERE user_id = $1
        AND symbol = $2;
    `;

    const result = await pool.query(query, [userId, symbol]);
    return result.rows[0];
};

// Add stock
const addStock = async (userId, symbol, companyName) => {
    const query = `
        INSERT INTO watchlist (user_id, symbol, company_name)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const result = await pool.query(query, [
        userId,
        symbol,
        companyName,
    ]);

    return result.rows[0];
};

// Get all stocks
const getWatchlist = async (userId) => {
    const query = `
        SELECT *
        FROM watchlist
        WHERE user_id = $1
        ORDER BY added_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
};

// Remove stock
const removeStock = async (userId, symbol) => {
    const query = `
        DELETE FROM watchlist
        WHERE user_id = $1
        AND symbol = $2
        RETURNING *;
    `;

    const result = await pool.query(query, [userId, symbol]);
    return result.rows[0];
};

module.exports = {
    findBySymbol,
    addStock,
    getWatchlist,
    removeStock,
};