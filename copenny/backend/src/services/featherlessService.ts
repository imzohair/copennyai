import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const featherlessClient = new OpenAI({
  apiKey: process.env.FEATHERLESS_API_KEY,
  baseURL: process.env.FEATHERLESS_BASE_URL || 'https://api.featherless.ai/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://copennyai.vercel.app',
    'X-Title': 'Copenny AI Financial Advisor',
  }
});

const DEFAULT_MODEL = process.env.FEATHERLESS_DEFAULT_MODEL || 'Qwen/Qwen3-32B';

export interface Insight {
  type: string;
  title: string;
  description: string;
  breakdown: any;
  reasoning: string;
  severity: string;
}

export interface Action {
  type: string;
  title: string;
  description: string;
  potentialSavings: number;
  steps: string[];
  requiresConfirmation: boolean;
  target?: string;
}

export async function testConnection(): Promise<boolean> {
  try {
    const response = await featherlessClient.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: 'Say hello!' }],
      max_tokens: 10,
    });
    return response.choices && response.choices.length > 0;
  } catch (error) {
    console.error('Featherless connection test failed:', error);
    return false;
  }
}

export async function generateInsight(transactions: any[], userContext: any): Promise<Insight[]> {
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
  } catch (error) {
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

export async function generateAction(userData: any, subscriptions: any[]): Promise<Action[]> {
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
  } catch (error) {
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

export async function explainReasoning(insight: any): Promise<string> {
  try {
    const response = await featherlessClient.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful financial assistant explaining an insight.' },
        { role: 'user', content: `Please explain this financial insight in detail, step-by-step: ${JSON.stringify(insight)}` }
      ]
    });
    return response.choices[0]?.message?.content || "No explanation provided.";
  } catch (error) {
    console.error('Failed to explain insight:', error);
    return "I am unable to provide a detailed explanation at this moment. Please check back later.";
  }
}

export async function classifyTransaction(description: string, amount: number): Promise<string> {
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
  } catch (error) {
    console.error('Failed to classify transaction:', error);
    return "Other"; // Fallback
  }
}

export async function detectAnomaly(transactions: any[]): Promise<any[]> {
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
  } catch (error) {
    console.error('Failed to detect anomalies:', error);
    return [];
  }
}
