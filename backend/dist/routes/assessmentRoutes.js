"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessmentController_1 = require("../controllers/assessmentController");
const auth_1 = require("../middleware/auth");
const validators_1 = require("../validators");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.validateRequest)(validators_1.submitAssessmentSchema), assessmentController_1.createAssessment);
exports.default = router;
