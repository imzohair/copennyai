"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const ruleController_1 = require("../controllers/ruleController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/', ruleController_1.getRules);
router.post('/', ruleController_1.createRule);
router.put('/:id', ruleController_1.updateRule);
router.delete('/:id', ruleController_1.deleteRule);
exports.default = router;
//# sourceMappingURL=ruleRoutes.js.map