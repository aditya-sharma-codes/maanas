"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./config/logger"));
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const assessmentRoutes_1 = __importDefault(require("./routes/assessmentRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'MANAS API is running' });
});
// Routes will be added here
app.use('/api/auth', authRoutes_1.default);
app.use('/api/assessments', assessmentRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
// Centralized error handling middleware
app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        logger_1.default.info(`Server is running on port ${port}`);
    });
}
exports.default = app;
