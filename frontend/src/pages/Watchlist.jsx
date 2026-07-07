import { useState, useEffect } from "react";
import watchlistService from "../services/watchlistService";
import Loader from "../components/Loader";

function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newSymbol, setNewSymbol] = useState("");
    const [adding, setAdding] = useState(false);
    const [addMessage, setAddMessage] = useState(null);
    const [deletingSymbol, setDeletingSymbol] = useState(null);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await watchlistService.getWatchlist();
            setWatchlist(data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load watchlist.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSymbol.trim()) return;

        setAdding(true);
        setAddMessage(null);
        try {
            await watchlistService.addToWatchlist(newSymbol.trim().toUpperCase());
            setAddMessage({ type: "success", text: `${newSymbol.toUpperCase()} added to watchlist.` });
            setNewSymbol("");
            await fetchWatchlist();
        } catch (err) {
            setAddMessage({ type: "error", text: err.response?.data?.message || "Failed to add stock." });
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (symbol) => {
        setDeletingSymbol(symbol);
        try {
            await watchlistService.removeFromWatchlist(symbol);
            await fetchWatchlist();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to remove ${symbol}.`);
        } finally {
            setDeletingSymbol(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Watchlist</h2>
                <button className="btn btn-outline" onClick={fetchWatchlist}>↻ Refresh</button>
            </div>

            {error && <div className="page-error" style={{ marginBottom: "1.5rem" }}>{error}</div>}

            {/* Add Stock Form */}
            <div className="section-card" style={{ marginBottom: "1.5rem" }}>
                <h3 className="section-title" style={{ marginBottom: "1rem" }}>Add Stock</h3>

                {addMessage && (
                    <div className={addMessage.type === "success" ? "auth-success-alert" : "auth-error-alert"}>
                        {addMessage.text}
                    </div>
                )}

                <form className="watchlist-add-form" onSubmit={handleAdd}>
                    <input
                        id="watchlist-symbol"
                        type="text"
                        placeholder="Enter symbol (e.g. AAPL)"
                        value={newSymbol}
                        onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                        disabled={adding}
                    />
                    <button
                        id="btn-add-watchlist"
                        type="submit"
                        className="btn btn-primary"
                        disabled={adding || !newSymbol.trim()}
                    >
                        {adding ? "Adding..." : "+ Add"}
                    </button>
                </form>
            </div>

            {/* Watchlist Table */}
            <div className="section-card">
                <div className="section-header">
                    <h3 className="section-title">Your Watchlist</h3>
                    <span className="section-meta">{watchlist.length} stock{watchlist.length !== 1 ? "s" : ""}</span>
                </div>

                {watchlist.length === 0 ? (
                    <div className="empty-state">Your watchlist is empty. Add a stock symbol above to track it.</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Company</th>
                                    <th>Current Price</th>
                                    <th>Added</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {watchlist.map((item) => (
                                    <tr key={item.id}>
                                        <td><span className="symbol-badge">{item.symbol}</span></td>
                                        <td className="text-muted">{item.companyName || "—"}</td>
                                        <td>
                                            {item.currentPrice != null
                                                ? `$${Number(item.currentPrice).toFixed(2)}`
                                                : "--"}
                                        </td>
                                        <td className="text-muted">
                                            {item.addedAt
                                                ? new Date(item.addedAt).toLocaleDateString()
                                                : "--"}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger-sm"
                                                disabled={deletingSymbol === item.symbol}
                                                onClick={() => handleDelete(item.symbol)}
                                            >
                                                {deletingSymbol === item.symbol ? "..." : "Remove"}
                                            </button>
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

export default Watchlist;
