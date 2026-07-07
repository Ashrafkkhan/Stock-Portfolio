const tradeService = require("../services/tradeService");

// Buy Stock
const buyStock = async (req, res) => {
    try {
        const userId = req.user.id;
        const { symbol, quantity } = req.body;

        if (!symbol || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Symbol and quantity are required",
            });
        }

        const result = await tradeService.buyStock(
            userId,
            symbol.toUpperCase(),
            Number(quantity)
        );

        return res.status(201).json({
            success: true,
            message: "Stock purchased successfully",
            data: result,
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

// Sell Stock
const sellStock = async (req, res) => {
    try {
        const userId = req.user.id;
        const { symbol, quantity } = req.body;

        if (!symbol || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Symbol and quantity are required",
            });
        }

        const result = await tradeService.sellStock(
            userId,
            symbol.toUpperCase(),
            Number(quantity)
        );

        return res.status(200).json({
            success: true,
            message: "Stock sold successfully",
            data: result,
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = {
    buyStock,
    sellStock,
};