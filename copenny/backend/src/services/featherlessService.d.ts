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
export declare function testConnection(): Promise<boolean>;
export declare function generateInsight(transactions: any[], userContext: any): Promise<Insight[]>;
export declare function generateAction(userData: any, subscriptions: any[]): Promise<Action[]>;
export declare function explainReasoning(insight: any): Promise<string>;
export declare function classifyTransaction(description: string, amount: number): Promise<string>;
export declare function detectAnomaly(transactions: any[]): Promise<any[]>;
export declare function processChatQuery(query: string, history: any[], userContext: any): Promise<string>;
//# sourceMappingURL=featherlessService.d.ts.map