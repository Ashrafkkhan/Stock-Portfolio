import { useState } from "react";
import tradeService from "../services/tradeService";

function Trade() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: "success" | "error", text: "..." }

    const handleTrade = async (action) => {
        if (!symbol.trim() || !quantity) {
            setMessage({ type: "error", text: "Please enter a stock symbol and quantity." });
            return;
        }
        if (Number(quantity) <= 0) {
            setMessage({ type: "error", text: "Quantity must be greater than zero." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const fn = action === "buy" ? tradeService.buyStock : tradeService.sellStock;
            const result = await fn(symbol.trim().toUpperCase(), Number(quantity));
            setMessage({ type: "success", text: result.message || `${action === "buy" ? "Buy" : "Sell"} order placed successfully!` });
            setSymbol("");
            setQuantity("");
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Trade failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Trade</h2>
            </div>

            <div className="trade-layout">
                <div className="trade-card">
                    <h3 className="section-title" style={{ marginBottom: "1.5rem" }}>Place Order</h3>

                    {message && (
                        <div className={message.type === "success" ? "auth-success-alert" : "auth-error-alert"}>
                            {message.text}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="trade-symbol">Stock Symbol</label>
                        <input
                            id="trade-symbol"
                            type="text"
                            placeholder="e.g. AAPL, TSLA, GOOGL"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: "1rem" }}>
                        <label htmlFor="trade-qty">Quantity</label>
                        <input
                            id="trade-qty"
                            type="number"
                            placeholder="Number of shares"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="trade-actions">
                        <button
                            id="btn-buy"
                            className="btn btn-buy"
                            disabled={loading}
                            onClick={() => handleTrade("buy")}
                        >
                            {loading ? "Processing..." : "📈 Buy"}
                        </button>
                        <button
                            id="btn-sell"
                            className="btn btn-sell"
                            disabled={loading}
                            onClick={() => handleTrade("sell")}
                        >
                            {loading ? "Processing..." : "📉 Sell"}
                        </button>
                    </div>
                </div>

                <div className="trade-info-card">
                    <h3 className="section-title" style={{ marginBottom: "1rem" }}>How It Works</h3>
                    <ul className="trade-info-list">
                        <li>🔍 Enter a valid stock ticker symbol (e.g. <strong>AAPL</strong>, <strong>TSLA</strong>)</li>
                        <li>🔢 Enter the number of shares you want to buy or sell</li>
                        <li>💰 Click <strong>Buy</strong> to purchase or <strong>Sell</strong> to liquidate</li>
                        <li>📊 Prices are fetched live from Finnhub at time of order</li>
                        <li>📋 All trades appear in your Transactions history</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Trade;
