const authService = require("../services/authService");

const register = async (req, res) => {

    try {

        const { fullName, email, password } = req.body;

        const user = await authService.register(
            fullName,
            email,
            password
        );

        res.status(201).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const token = await authService.login(
            email,
            password
        );

        res.json({
            success: true,
            token
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const profile = async (req, res) => {

    try {

        const user = await authService.getProfile(req.user.id);

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    register,
    login,
    profile
};