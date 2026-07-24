"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// These endpoints require institute login
router.use(auth_1.authenticateJWT);
router.get('/stats', dashboardController_1.getStats);
router.get('/departments', dashboardController_1.getDepartments);
exports.default = router;
