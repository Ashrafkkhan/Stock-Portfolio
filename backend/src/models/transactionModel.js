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

module.exports = {
    createTransaction,
    getTransactionsByUser,
    getTransactionsBySymbol,
};