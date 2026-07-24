"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_for_manas', (err, user) => {
            if (err) {
                return (0, response_1.sendError)(res, 'Forbidden', [], 403);
            }
            req.user = user;
            next();
        });
    }
    else {
        return (0, response_1.sendError)(res, 'Unauthorized', [], 401);
    }
};
exports.authenticateJWT = authenticateJWT;
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.validateRequest = validateRequest;
