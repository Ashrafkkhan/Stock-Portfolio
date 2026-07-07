const NodeCache = require("node-cache");
const stockApi = require("../config/stockApi");

const cache = new NodeCache({
    stdTTL: 300, // Cache for 5 minutes
    checkperiod: 320,
});

// Search companies
const searchStocks = async (query) => {
    const cacheKey = `search_${query.toLowerCase()}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await stockApi.get("/search", {
            params: {
                q: query,
            },
        });

        const stocks = response.data.result.map((stock) => ({
            symbol: stock.symbol,
            name: stock.description,
        }));

        cache.set(cacheKey, stocks);

        return stocks;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        handleApiError(error);
    }
};

// Get current stock price + company details
const getStockDetails = async (symbol) => {
    const cacheKey = `stock_${symbol.toUpperCase()}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const [quoteResponse, profileResponse] = await Promise.all([
            stockApi.get("/quote", {
                params: {
                    symbol: symbol.toUpperCase(),
                },
            }),

            stockApi.get("/stock/profile2", {
                params: {
                    symbol: symbol.toUpperCase(),
                },
            }),
        ]);

        if (!profileResponse.data || Object.keys(profileResponse.data).length === 0) {
            const err = new Error("Stock symbol not found");
            err.status = 404;
            throw err;
        }

        const stock = {
            symbol: symbol.toUpperCase(),
            company: profileResponse.data.name,
            price: quoteResponse.data.c,
            currency: profileResponse.data.currency,
            exchange: profileResponse.data.exchange,
            logo: profileResponse.data.logo,
        };

        cache.set(cacheKey, stock);

        return stock;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        handleApiError(error);
    }
};

// Get historical prices (last 30 days)
const getStockHistory = async (symbol) => {

    const cacheKey = `history_${symbol.toUpperCase()}`;

    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {

        const axios = require("axios");

        const response = await axios.get(
            "https://www.alphavantage.co/query",
            {
                params: {
                    function: "TIME_SERIES_DAILY",
                    symbol: symbol.toUpperCase(),
                    apikey: process.env.ALPHA_VANTAGE_API_KEY,
                },
            }
        );

        if (response.data["Error Message"]) {
            const err = new Error("Invalid stock symbol");
            err.status = 404;
            throw err;
        }

        if (response.data["Note"]) {
            const err = new Error("API rate limit exceeded");
            err.status = 429;
            throw err;
        }

        const timeSeries = response.data["Time Series (Daily)"];

        if (!timeSeries) {
            const err = new Error("Historical data not found");
            err.status = 404;
            throw err;
        }

        const history = Object.entries(timeSeries)
            .slice(0, 30)
            .map(([date, values]) => ({
                date,
                open: Number(values["1. open"]),
                high: Number(values["2. high"]),
                low: Number(values["3. low"]),
                close: Number(values["4. close"]),
                volume: Number(values["5. volume"]),
            }));

        cache.set(cacheKey, history);

        return history;

    } catch (error) {

        if (error.status) {
            throw error;
        }

        const err = new Error("Unable to fetch historical data");
        err.status = 503;
        throw err;
    }
};

// Common API Error Handler
const handleApiError = (error) => {

    if (error.status) {
        throw error;
    }

    if (error.response) {

        if (error.response.status === 429) {
            const err = new Error("Finnhub API rate limit exceeded");
            err.status = 429;
            throw err;
        }

        const err = new Error("Finnhub API error");
        err.status = error.response.status;
        throw err;
    }


    const err = new Error("Stock service unavailable");
    err.status = 503;
    throw err;
};

// Get quote for symbol
const getQuote = async (symbol) => {
    const cacheKey = `quote_${symbol.toUpperCase()}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await stockApi.get("/quote", {
            params: {
                symbol: symbol.toUpperCase(),
            },
        });

        const quote = {
            currentPrice: response.data.c,
            high: response.data.h,
            low: response.data.l,
            open: response.data.o,
            previousClose: response.data.pc,
        };

        cache.set(cacheKey, quote);

        return quote;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        handleApiError(error);
    }
};

// Get company profile
const getCompanyProfile = async (symbol) => {
    const cacheKey = `profile_${symbol.toUpperCase()}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await stockApi.get("/stock/profile2", {
            params: {
                symbol: symbol.toUpperCase(),
            },
        });

        if (!response.data || Object.keys(response.data).length === 0) {
            const err = new Error("Stock symbol not found");
            err.status = 404;
            throw err;
        }

        cache.set(cacheKey, response.data);

        return response.data;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);

        handleApiError(error);
    }
};

module.exports = {
    searchStocks,
    getStockDetails,
    getStockHistory,
    getQuote,
    getCompanyProfile,
};