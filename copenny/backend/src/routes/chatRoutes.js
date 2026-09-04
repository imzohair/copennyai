"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const chatController_1 = require("../controllers/chatController");
const router = (0, express_1.Router)();
// All chat/AI routes require authentication
router.use(auth_1.authenticateToken);
router.post('/insights', chatController_1.generateInsights);
router.post('/actions', chatController_1.generateActions);
router.post('/explain', chatController_1.explainInsight);
router.post('/classify', chatController_1.classifyTransaction);
router.post('/execute-action', chatController_1.executeAction);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map