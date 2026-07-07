import api from "./api";

// GET /api/stocks/search?q=query
const searchStocks = async (query) => {
    const response = await api.get(`/stocks/search?q=${encodeURIComponent(query)}`);
    return response.data;
};

// GET /api/stocks/:symbol
const getStock = async (symbol) => {
    const response = await api.get(`/stocks/${symbol}`);
    return response.data;
};

const stockService = { searchStocks, getStock };
export default stockService;
