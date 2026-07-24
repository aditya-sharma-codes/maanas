"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../config/logger"));
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(`${err.message} - ${req.method} ${req.url}`, {
        stack: err.stack,
        body: req.body,
        params: req.params,
        query: req.query,
    });
    if (err instanceof zod_1.ZodError) {
        const formattedErrors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return (0, response_1.sendError)(res, 'Validation failed', formattedErrors, 400);
    }
    if (err.name === 'UnauthorizedError') {
        return (0, response_1.sendError)(res, 'Unauthorized access', [], 401);
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    (0, response_1.sendError)(res, message, [], statusCode);
};
exports.errorHandler = errorHandler;
