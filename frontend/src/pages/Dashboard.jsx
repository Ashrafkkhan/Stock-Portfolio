import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dashboardService from "../services/dashboardService";
import Loader from "../components/Loader";

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await dashboardService.getDashboard();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val) =>
        typeof val === "number" ? `$${val.toFixed(2)}` : "--";

    const isPositive = (val) => typeof val === "number" && val >= 0;

    if (loading) return <Loader />;

    if (error) return (
        <div className="page-container">
            <div className="page-error">{error}</div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Dashboard</h2>
                <button className="btn btn-outline" onClick={fetchDashboard}>↻ Refresh</button>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Investment</div>
                    <div className="stat-value">{formatCurrency(data?.totalInvestment)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Current Value</div>
                    <div className="stat-value">{formatCurrency(data?.currentValue)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total P&L</div>
                    <div className={`stat-value ${isPositive(data?.totalProfitLoss) ? "text-green" : "text-red"}`}>
                        {formatCurrency(data?.totalProfitLoss)}{" "}
                        <span className="stat-percent">
                            ({isPositive(data?.totalProfitLoss) ? "+" : ""}{data?.totalProfitLossPercent}%)
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Holdings</div>
                    <div className="stat-value">{data?.totalHoldings ?? "--"}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Watchlist</div>
                    <div className="stat-value">{data?.watchlistCount ?? "--"}</div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="section-card">
                <div className="section-header">
                    <h3 className="section-title">Recent Transactions</h3>
                    <Link to="/transactions" className="section-link">View All →</Link>
                </div>
                {data?.recentTransactions?.length === 0 ? (
                    <div className="empty-state">No transactions yet. <Link to="/trade">Make a trade →</Link></div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.recentTransactions?.map((tx) => (
                                    <tr key={tx.id}>
                                        <td><span className="symbol-badge">{tx.symbol}</span></td>
                                        <td>
                                            <span className={`type-badge ${tx.transaction_type === "BUY" ? "type-buy" : "type-sell"}`}>
                                                {tx.transaction_type}
                                            </span>
                                        </td>
                                        <td>{tx.quantity}</td>
                                        <td>${Number(tx.price).toFixed(2)}</td>
                                        <td>${Number(tx.total_amount).toFixed(2)}</td>
                                        <td className="text-muted">
                                            {tx.transaction_time
                                                ? new Date(tx.transaction_time).toLocaleDateString()
                                                : "--"}
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

export default Dashboard;
