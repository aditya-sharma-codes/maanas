"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartments = exports.getStats = void 0;
const dashboardService_1 = require("../services/dashboardService");
const response_1 = require("../utils/response");
const getStats = async (req, res, next) => {
    try {
        const stats = await (0, dashboardService_1.getDashboardStats)();
        return (0, response_1.sendSuccess)(res, 'Dashboard stats retrieved', stats);
    }
    catch (error) {
        next(error);
    }
};
exports.getStats = getStats;
const getDepartments = async (req, res, next) => {
    try {
        const analysis = await (0, dashboardService_1.getDepartmentAnalysis)();
        return (0, response_1.sendSuccess)(res, 'Department analysis retrieved', analysis);
    }
    catch (error) {
        next(error);
    }
};
exports.getDepartments = getDepartments;
