"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// GET /api/transactions?startDate=&endDate=&category=&type=&limit=&offset=
router.get('/', transactionController_1.getTransactions);
// GET /api/transactions/categories
router.get('/categories', transactionController_1.getCategories);
// POST /api/transactions
router.post('/', transactionController_1.createTransactionHandler);
// PUT /api/transactions/:id
router.put('/:id', transactionController_1.updateTransactionHandler);
// DELETE /api/transactions/:id
router.delete('/:id', transactionController_1.deleteTransactionHandler);
// POST /api/transactions/import  (multipart/form-data, field: "file")
router.post('/import', transactionController_1.upload.single('file'), transactionController_1.importCSVHandler);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map