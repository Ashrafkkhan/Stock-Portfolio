const axios = require("axios");

const stockApi = axios.create({
    baseURL: "https://finnhub.io/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach API key to every request
stockApi.interceptors.request.use((config) => {
    config.params = {
        ...config.params,
        token: process.env.FINNHUB_API_KEY,
    };

    return config;
});

module.exports = stockApi;