const pool = require("../config/db");
const stockService = require("./stockService");
const holdingModel = require("../models/holdingModel");
const transactionModel = require("../models/transactionModel");

/**
 * Buy stock business logic.
 * 
 * @param {number} userId - The ID of the user buying the stock.
 * @param {string} symbol - The stock symbol.
 * @param {number} quantity - The quantity of shares to buy.
 * @returns {Promise<object>} The updated holding.
 */
const buyStock = async (userId, symbol, quantity) => {
    // Validate quantity
    if (!quantity || quantity <= 0) {
        const error = new Error("Quantity must be greater than zero");
        error.status = 400;
        throw error;
    }

    // Fetch current stock details
    const stockDetails = await stockService.getStockDetails(symbol);
    const latestPrice = Number(stockDetails.price);
    const companyName = stockDetails.company;
    const totalAmount = quantity * latestPrice;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Find existing holding
        const existingHolding = await holdingModel.findHoldingByUserAndSymbol(
            client,
            userId,
            symbol
        );

        let updatedHolding;

        if (!existingHolding) {
            // Create a new holding
            updatedHolding = await holdingModel.createHolding(
                client,
                userId,
                symbol,
                companyName,
                quantity,
                latestPrice
            );
        } else {
            // Recalculate weighted average price
            const oldQuantity = Number(existingHolding.quantity);
            const oldAveragePrice = Number(existingHolding.average_buy_price);
            const newQuantity = oldQuantity + quantity;
            const newAveragePrice = (
                (oldQuantity * oldAveragePrice) + (quantity * latestPrice)
            ) / newQuantity;

            // Update existing holding
            updatedHolding = await holdingModel.updateHolding(
                client,
                existingHolding.id,
                newQuantity,
                newAveragePrice
            );
        }

        // Insert BUY transaction
        await transactionModel.createTransaction(
            client,
            userId,
            symbol,
            companyName,
            "BUY",
            quantity,
            latestPrice,
            totalAmount
        );

        await client.query("COMMIT");
        return updatedHolding;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Sell stock business logic.
 * 
 * @param {number} userId - The ID of the user selling the stock.
 * @param {string} symbol - The stock symbol.
 * @param {number} quantity - The quantity of shares to sell.
 * @returns {Promise<object|null>} The updated holding or null/holding info with 0 quantity if deleted.
 */
const sellStock = async (userId, symbol, quantity) => {
    // Validate quantity
    if (!quantity || quantity <= 0) {
        const error = new Error("Quantity must be greater than zero");
        error.status = 400;
        throw error;
    }

    // Fetch current stock details
    const stockDetails = await stockService.getStockDetails(symbol);
    const latestPrice = Number(stockDetails.price);
    const companyName = stockDetails.company;
    const totalAmount = quantity * latestPrice;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Find existing holding
        const existingHolding = await holdingModel.findHoldingByUserAndSymbol(
            client,
            userId,
            symbol
        );

        // If holding does not exist
        if (!existingHolding) {
            const error = new Error("Holding not found");
            error.status = 404;
            throw error;
        }

        // Prevent overselling
        const ownedQuantity = Number(existingHolding.quantity);
        if (quantity > ownedQuantity) {
            const error = new Error("Insufficient shares");
            error.status = 400;
            throw error;
        }

        // Insert SELL transaction
        await transactionModel.createTransaction(
            client,
            userId,
            symbol,
            companyName,
            "SELL",
            quantity,
            latestPrice,
            totalAmount
        );

        let updatedHolding;
        const newQuantity = ownedQuantity - quantity;

        if (newQuantity === 0) {
            // Delete the holding row if all shares sold
            await holdingModel.deleteHolding(client, existingHolding.id);
            updatedHolding = {
                ...existingHolding,
                quantity: 0
            };
        } else {
            // Update quantity with unchanged average buy price
            updatedHolding = await holdingModel.updateHolding(
                client,
                existingHolding.id,
                newQuantity,
                Number(existingHolding.average_buy_price)
            );
        }

        await client.query("COMMIT");
        return updatedHolding;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    buyStock,
    sellStock,
};
