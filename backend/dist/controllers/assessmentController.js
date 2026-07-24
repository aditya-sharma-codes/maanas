"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssessment = void 0;
const assessmentService_1 = require("../services/assessmentService");
const response_1 = require("../utils/response");
const createAssessment = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await (0, assessmentService_1.submitAssessment)(data);
        return (0, response_1.sendSuccess)(res, 'Assessment submitted successfully', result, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createAssessment = createAssessment;
