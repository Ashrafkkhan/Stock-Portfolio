const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res, next) => {

    try {

        const userId = req.user.id;

        const dashboard = await dashboardService.getDashboard(userId);

        res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    getDashboard
};