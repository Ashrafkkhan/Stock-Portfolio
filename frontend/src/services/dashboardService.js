import api from "./api";

// GET /api/dashboard
const getDashboard = async () => {
    const response = await api.get("/dashboard");
    return response.data.data; // { totalInvestment, currentValue, totalProfitLoss, ... }
};

const dashboardService = { getDashboard };
export default dashboardService;
