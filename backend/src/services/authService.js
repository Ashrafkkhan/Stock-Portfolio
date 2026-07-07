const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const jwtConfig = require("../config/jwt");

const register = async (fullName, email, password) => {

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser(
        fullName,
        email,
        hashedPassword
    );

    return user;
};

const login = async (email, password) => {

    const user = await userModel.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.expiresIn
        }
    );

    return token;
};

const getProfile = async (id) => {
    return await userModel.findUserById(id);
};

module.exports = {
    register,
    login,
    getProfile
};