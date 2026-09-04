"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const budgetRoutes_1 = __importDefault(require("./routes/budgetRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const ruleRoutes_1 = __importDefault(require("./routes/ruleRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("./config/db");
const subscriptionService_1 = require("./services/subscriptionService");
const ruleEngineService_1 = require("./services/ruleEngineService");
const http_1 = __importDefault(require("http"));
const websocketService_1 = require("./services/websocketService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Copenny API is running' });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/goals', goalRoutes_1.default);
app.use('/api/subscriptions', subscriptionRoutes_1.default);
app.use('/api/budgets', budgetRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/rules', ruleRoutes_1.default);
// Background Cron Jobs
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('Running daily background jobs...');
    try {
        const usersRes = await (0, db_1.query)('SELECT id FROM users');
        const users = usersRes.rows;
        for (const user of users) {
            const userId = user.id;
            // 1. Detect new subscriptions
            await (0, subscriptionService_1.detectSubscriptions)(userId);
            // 2. Evaluate all financial rules
            await (0, ruleEngineService_1.evaluateRules)(userId);
        }
        console.log('Daily background jobs completed successfully.');
    }
    catch (err) {
        console.error('Error running background jobs:', err);
    }
});
// Error Handler Middleware (must be registered last)
app.use(errorHandler_1.errorHandler);
const server = http_1.default.createServer(app);
// Initialize WebSockets
(0, websocketService_1.initializeWebSocket)(server);
server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map