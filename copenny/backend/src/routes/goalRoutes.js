"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const goalController_1 = require("../controllers/goalController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/', goalController_1.getGoals);
router.post('/', goalController_1.createGoal);
router.put('/:id/progress', goalController_1.updateGoalProgress);
router.delete('/:id', goalController_1.deleteGoal);
exports.default = router;
//# sourceMappingURL=goalRoutes.js.map