"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = testConnection;
exports.generateInsight = generateInsight;
exports.generateAction = generateAction;
exports.explainReasoning = explainReasoning;
exports.classifyTransaction = classifyTransaction;
exports.detectAnomaly = detectAnomaly;
exports.processChatQuery = processChatQuery;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const featherlessClient = new openai_1.default({
    apiKey: process.env.FEATHERLESS_API_KEY,
    baseURL: process.env.FEATHERLESS_BASE_URL || 'https://api.featherless.ai/v1',
    defaultHeaders: {
        'HTTP-Referer': 'https://copennyai.vercel.app',
        'X-Title': 'Copenny AI Financial Advisor',
    }
});
const DEFAULT_MODEL = process.env.FEATHERLESS_DEFAULT_MODEL || 'Qwen/Qwen3-32B';
async function testConnection() {
    try {
        const response = await featherlessClient.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [{ role: 'user', content: 'Say hello!' }],
            max_tokens: 10,
        });
        return response.choices && response.choices.length > 0;
    }
    catch (error) {
        console.error('Featherless connection test failed:', error);
        return false;
    }
}
async function generateInsight(transactions, userContext) {
    const prompt = `Analyze these transactions and provide financial insights. 
  Transactions: ${JSON.stringify(transactions.slice(0, 50))}
  Context: ${JSON.stringify(userContext)}
  Return a JSON array of insights with this exact structure: [{ "type": "spending_alert", "title": "...", "description": "...", "breakdown": {}, "reasoning": "...", "severity": "high" }]`;
    try {
        const response = await featherlessClient.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
                { role: 'system', content: 'You are an expert financial advisor. Output only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content || '{"insights":[]}';
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : (parsed.insights || []);
    }
    catch (error) {
        console.error('Failed to generate insights:', error);
        // Fallback
        return [{
                type: "info",
                title: "AI Service Temporarily Unavailable",
                description: "We couldn't generate dynamic insights right now, but you are tracking your spending well.",
                breakdown: {},
                reasoning: "Fallback triggered due to API failure.",
                severity: "low"
            }];
    }
}
async function generateAction(userData, subscriptions) {
    const prompt = `Based on these subscriptions and user data, suggest actionable steps to save money.
  Data: ${JSON.stringify(userData)}
  Subscriptions: ${JSON.stringify(subscriptions)}
  Return a JSON array of actions with this exact structure: [{ "type": "cancel_subscription", "title": "...", "description": "...", "potentialSavings": 1000, "steps": ["..."], "requiresConfirmation": true, "target": "Netflix" }]`;
    try {
        const response = await featherlessClient.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
                { role: 'system', content: 'You are a proactive wealth manager. Output only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content || '{"actions":[]}';
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : (parsed.actions || []);
    }
    catch (error) {
        console.error('Failed to generate actions:', error);
        // Fallback
        return [{
                type: "review",
                title: "Review Subscriptions Manually",
                description: "Our AI is currently taking a break. Please review your active subscriptions manually to identify savings.",
                potentialSavings: 0,
                steps: ["Navigate to the Subscriptions tab", "Cancel unused services"],
                requiresConfirmation: false
            }];
    }
}
async function explainReasoning(insight) {
    try {
        const response = await featherlessClient.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
                { role: 'system', content: 'You are a helpful financial assistant explaining an insight.' },
                { role: 'user', content: `Please explain this financial insight in detail, step-by-step: ${JSON.stringify(insight)}` }
            ]
        });
        return response.choices[0]?.message?.content || "No explanation provided.";
    }
    catch (error) {
        console.error('Failed to explain insight:', error);
        return "I am unable to provide a detailed explanation at this moment. Please check back later.";
    }
}
async function classifyTransaction(description, amount) {
    const prompt = `Classify this transaction: "${description}" for amount ₹${amount}. 
  Choose EXACTLY ONE from these categories: Dining, Shopping, Bills, Entertainment, Transport, Groceries, Healthcare, Education, Salary, Investment, Rent, Utilities, Other. 
  Output only a JSON object like {"category": "..."}`;
    try {
        const response = await featherlessClient.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
                { role: 'system', content: 'You are an accurate transaction classifier. Output only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content || '{"category": "Other"}';
        const parsed = JSON.parse(content);
        return parsed.category || "Other";
    }
    catch (error) {
        console.error('Failed to classify transaction:', error);
        return "Other"; // Fallback
    }
}
async function detectAnomaly(transactions) {
    const prompt = `Analyze these transactions for unusual spikes or suspicious activity. 
  Transactions: ${JSON.stringify(transactions.slice(0, 50))}
  Return a JSON array of anomalies. If none, return empty array. Structure: [{ "transactionId": 1, "reason": "Unusually high amount for this category" }]`;
    try {
        const response = await featherlessClient.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
                { role: 'system', content: 'You are a fraud and anomaly detection AI. Output only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content || '{"anomalies":[]}';
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : (parsed.anomalies || []);
    }
    catch (error) {
        console.error('Failed to detect anomalies:', error);
        return [];
    }
}
async function processChatQuery(query, history, userContext) {
    try {
        const messages = [
            {
                role: 'system',
                content: `You are Copenny AI, an intelligent personal wealth advisor. 
        Use the following user context to provide highly personalized, concise, and actionable advice:
        Context: ${JSON.stringify(userContext)}
        Format your response in clean markdown.`
            },
            // Insert history here
            ...history.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: query }
        ];
        const response = await featherlessClient.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: messages,
        });
        return response.choices[0]?.message?.content || "I'm sorry, I couldn't process your request.";
    }
    catch (error) {
        console.error('Failed to process chat query:', error);
        return "I am currently experiencing connection issues. Please try again later.";
    }
}
//# sourceMappingURL=featherlessService.js.map