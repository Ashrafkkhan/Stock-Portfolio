import api from "./api";

// POST /api/trade/buy
const buyStock = async (symbol, quantity) => {
    const response = await api.post("/trade/buy", { symbol, quantity });
    return response.data;
};

// POST /api/trade/sell
const sellStock = async (symbol, quantity) => {
    const response = await api.post("/trade/sell", { symbol, quantity });
    return response.data;
};

const tradeService = { buyStock, sellStock };
export default tradeService;
