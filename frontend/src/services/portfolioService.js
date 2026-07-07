import api from "./api";

// GET /api/portfolio  → { holdings: [...] }
const getPortfolio = async () => {
    const response = await api.get("/portfolio");
    return response.data.holdings;
};

// GET /api/portfolio/summary  → { totalInvestment, currentValue, totalProfit, returnPercentage }
const getPortfolioSummary = async () => {
    const response = await api.get("/portfolio/summary");
    return response.data;
};

const portfolioService = { getPortfolio, getPortfolioSummary };
export default portfolioService;
