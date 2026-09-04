"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const subscriptionController_1 = require("../controllers/subscriptionController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
router.get('/', subscriptionController_1.getSubscriptions);
router.post('/', subscriptionController_1.createSubscription);
router.put('/:id', subscriptionController_1.updateSubscription);
router.delete('/:id', subscriptionController_1.deleteSubscription);
router.post('/detect', subscriptionController_1.detectSubscriptions);
exports.default = router;
//# sourceMappingURL=subscriptionRoutes.js.map