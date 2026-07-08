import { useState, useEffect } from "react";
import transactionService from "../services/transactionService";
import Loader from "../components/Loader";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await transactionService.getTransactions();
            setTransactions(data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    if (error) return (
        <div className="page-container">
            <div className="page-error">{error}</div>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Transaction History</h2>
                <button className="btn btn-outline" onClick={fetchTransactions}>↻ Refresh</button>
            </div>

            <div className="section-card">
                <div className="section-header">
                    <h3 className="section-title">All Transactions</h3>
                    <span className="section-meta">{transactions.length} total</span>
                </div>

                {transactions.length === 0 ? (
                    <div className="empty-state">No transactions yet. Head to Trade to place your first order.</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Company</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td><span className="symbol-badge">{tx.symbol}</span></td>
                                        <td className="text-muted">{tx.companyName || "—"}</td>
                                        <td>
                                            <span className={`type-badge ${tx.type === "BUY" ? "type-buy" : "type-sell"}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td>{tx.quantity}</td>
                                        <td>${Number(tx.price).toFixed(2)}</td>
                                        <td>${Number(tx.totalAmount).toFixed(2)}</td>
                                        <td className="text-muted">{tx.date || "--"}</td>
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

export default Transactions;
