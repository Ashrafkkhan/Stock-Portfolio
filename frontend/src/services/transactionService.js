import api from "./api";

// GET /api/transactions  → { transactions: [...] }
const getTransactions = async () => {
    const response = await api.get("/transactions");
    return response.data.transactions;
};

const transactionService = { getTransactions };
export default transactionService;
