"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginInstitute = void 0;
const prisma_1 = require("../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginInstitute = async (email, password) => {
    const institute = await prisma_1.prisma.institute.findUnique({ where: { email } });
    if (!institute)
        throw new Error('Invalid credentials');
    const isMatch = await bcryptjs_1.default.compare(password, institute.password);
    if (!isMatch)
        throw new Error('Invalid credentials');
    const token = jsonwebtoken_1.default.sign({ id: institute.id, email: institute.email }, process.env.JWT_SECRET || 'supersecret_jwt_key_for_manas', { expiresIn: '1d' });
    return { token, user: { id: institute.id, name: institute.name, email: institute.email } };
};
exports.loginInstitute = loginInstitute;
