const pool = require("../config/db");

// Find holding by user and stock symbol
const findHoldingByUserAndSymbol = async (
    client,
    userId,
    symbol
) => {

    const query = `
        SELECT *
        FROM holdings
        WHERE user_id = $1
        AND symbol = $2
    `;

    const result = await client.query(query, [
        userId,
        symbol,
    ]);

    return result.rows[0];
};
// Create a new holding
const createHolding = async (
    client,
    userId,
    symbol,
    companyName,
    quantity,
    averageBuyPrice
) => {

    const query = `
        INSERT INTO holdings
        (
            user_id,
            symbol,
            company_name,
            quantity,
            average_buy_price
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING *;
    `;

    const result = await client.query(query, [
        userId,
        symbol,
        companyName,
        quantity,
        averageBuyPrice,
    ]);

    return result.rows[0];
};

// Update existing holding
const updateHolding = async (
    client,
    holdingId,
    quantity,
    averageBuyPrice
) => {

    const query = `
        UPDATE holdings
        SET
            quantity = $1,
            average_buy_price = $2
        WHERE id = $3
        RETURNING *;
    `;

    const result = await client.query(query, [
        quantity,
        averageBuyPrice,
        holdingId,
    ]);

    return result.rows[0];
};

// Delete holding if all shares are sold
const deleteHolding = async (client, holdingId) => {

    const query = `
        DELETE FROM holdings
        WHERE id = $1;
    `;

    await client.query(query, [holdingId]);
};

// Get all holdings of a user
const getHoldingsByUser = async (userId) => {
    const query = `
        SELECT *
        FROM holdings
        WHERE user_id = $1;
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};

module.exports = {
    findHoldingByUserAndSymbol,
    createHolding,
    updateHolding,
    deleteHolding,
    getHoldingsByUser,
};