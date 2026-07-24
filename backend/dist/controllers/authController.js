"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await (0, authService_1.loginInstitute)(email, password);
        return (0, response_1.sendSuccess)(res, 'Login successful', result);
    }
    catch (error) {
        if (error.message === 'Invalid credentials') {
            return (0, response_1.sendError)(res, error.message, [], 401);
        }
        next(error);
    }
};
exports.login = login;
