const pool = require("../config/db");

// Create a new BUY or SELL transaction
const createTransaction = async (
    client,
    userId,
    symbol,
    companyName,
    transactionType,
    quantity,
    price,
    totalAmount
) => {

    const query = `
        INSERT INTO transactions
        (
            user_id,
            symbol,
            company_name,
            transaction_type,
            quantity,
            price,
            total_amount
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        RETURNING *;
    `;

    const result = await client.query(query, [
        userId,
        symbol,
        companyName,
        transactionType,
        quantity,
        price,
        totalAmount,
    ]);

    return result.rows[0];
};

//dashboard
const getRecentTransactions = async (userId) => {

    const query = `
        SELECT *
        FROM transactions
        WHERE user_id=$1
        ORDER BY transaction_time DESC
        LIMIT 5
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};

// Get all transactions of a user
const getTransactionsByUser = async (userId) => {

    const query = `
        SELECT *
        FROM transactions
        WHERE user_id = $1
        ORDER BY transaction_time DESC;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};

// Get transactions for a specific stock
const getTransactionsBySymbol = async (userId, symbol) => {

    const query = `
        SELECT *
        FROM transactions
        WHERE user_id = $1
        AND symbol = $2
        ORDER BY transaction_time DESC;
    `;

    const result = await pool.query(query, [
        userId,
        symbol,
    ]);

    return result.rows;
};

// Get transactions with optional filtering and pagination
const getTransactions = async (userId, filters = {}) => {
    const { type, page, limit } = filters;

    let query = `
        SELECT *
        FROM transactions
        WHERE user_id = $1
    `;
    const params = [userId];

    if (type) {
        params.push(type.toUpperCase());
        query += ` AND transaction_type = $${params.length}`;
    }

    query += ` ORDER BY transaction_time DESC`;

    if (limit) {
        params.push(limit);
        query += ` LIMIT $${params.length}`;

        if (page) {
            const offset = (page - 1) * limit;
            params.push(offset);
            query += ` OFFSET $${params.length}`;
        }
    }

    const result = await pool.query(query, params);
    return result.rows;
};

// Count total transactions with optional filtering
const getTransactionsCount = async (userId, filters = {}) => {
    const { type } = filters;

    let query = `
        SELECT COUNT(*) as total
        FROM transactions
        WHERE user_id = $1
    `;
    const params = [userId];

    if (type) {
        params.push(type.toUpperCase());
        query += ` AND transaction_type = $${params.length}`;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].total, 10);
};

module.exports = {
    createTransaction,
    getTransactionsByUser,
    getTransactionsBySymbol,
    getTransactions,
    getTransactionsCount,
    getRecentTransactions,
};