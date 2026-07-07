module.exports = {
    secret: process.env.JWT_SECRET || "mySuperSecretKey",
    expiresIn: "1d"
};