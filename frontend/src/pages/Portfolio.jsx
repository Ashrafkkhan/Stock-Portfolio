import { useState, useEffect } from "react";
import portfolioService from "../services/portfolioService";
import Loader from "../components/Loader";

function Portfolio() {
    const [holdings, setHoldings] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        setLoading(true);
        setError("");
        try {
            const [holdingsData, summaryData] = await Promise.all([
                portfolioService.getPortfolio(),
                portfolioService.getPortfolioSummary(),
            ]);
            setHoldings(holdingsData || []);
            setSummary(summaryData);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load portfolio.");
        } finally {
            setLoading(false);
        }
    };

    const fmt = (val) => (typeof val === "number" ? `$${val.toFixed(2)}` : "--");

    if (loading) return <Loader />;

    if (error) return (
        <div className="page-container">
            <div className="page-error">{error}</div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Portfolio</h2>
                <button className="btn btn-outline" onClick={fetchPortfolio}>↻ Refresh</button>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Investment</div>
                        <div className="stat-value">{fmt(summary.totalInvestment)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Current Value</div>
                        <div className="stat-value">{fmt(summary.currentValue)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Profit</div>
                        <div className={`stat-value ${summary.totalProfit >= 0 ? "text-green" : "text-red"}`}>
                            {fmt(summary.totalProfit)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Return %</div>
                        <div className={`stat-value ${summary.returnPercentage >= 0 ? "text-green" : "text-red"}`}>
                            {summary.returnPercentage >= 0 ? "+" : ""}{summary.returnPercentage?.toFixed(2)}%
                        </div>
                    </div>
                </div>
            )}

            {/* Holdings Table */}
            <div className="section-card">
                <div className="section-header">
                    <h3 className="section-title">Holdings</h3>
                    <span className="section-meta">{holdings.length} stock{holdings.length !== 1 ? "s" : ""}</span>
                </div>
                {holdings.length === 0 ? (
                    <div className="empty-state">No holdings yet. Start trading to build your portfolio.</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Company</th>
                                    <th>Qty</th>
                                    <th>Avg Buy Price</th>
                                    <th>Current Price</th>
                                    <th>Current Value</th>
                                    <th>P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((h) => (
                                    <tr key={h.symbol}>
                                        <td><span className="symbol-badge">{h.symbol}</span></td>
                                        <td className="text-muted">{h.company_name || h.companyName || "—"}</td>
                                        <td>{h.quantity}</td>
                                        <td>{fmt(h.averageBuyPrice)}</td>
                                        <td>{fmt(h.currentPrice)}</td>
                                        <td>{fmt(h.currentValue)}</td>
                                        <td className={h.profitLoss >= 0 ? "text-green" : "text-red"}>
                                            {h.profitLoss >= 0 ? "+" : ""}{fmt(h.profitLoss)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Portfolio;
