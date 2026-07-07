import api from "./api";

// GET /api/watchlist  → array of { id, symbol, companyName, currentPrice, addedAt }
const getWatchlist = async () => {
    const response = await api.get("/watchlist");
    return response.data.data;
};

// POST /api/watchlist  → { symbol }
const addToWatchlist = async (symbol) => {
    const response = await api.post("/watchlist", { symbol });
    return response.data;
};

// DELETE /api/watchlist/:symbol
const removeFromWatchlist = async (symbol) => {
    const response = await api.delete(`/watchlist/${symbol}`);
    return response.data;
};

const watchlistService = { getWatchlist, addToWatchlist, removeFromWatchlist };
export default watchlistService;
