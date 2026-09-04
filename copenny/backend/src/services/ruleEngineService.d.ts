export interface Rule {
    id?: number;
    user_id: number;
    name: string;
    condition: any;
    action: any;
    is_active: boolean;
}
export declare function evaluateRules(userId: number): Promise<void>;
export declare function executeAction(rule: Rule, context: any): Promise<void>;
export declare function getRules(userId: number): Promise<any[]>;
export declare function createRule(userId: number, data: Omit<Rule, 'id' | 'user_id'>): Promise<any>;
export declare function updateRule(id: number, userId: number, data: Partial<Rule>): Promise<any>;
export declare function deleteRule(id: number, userId: number): Promise<boolean>;
//# sourceMappingURL=ruleEngineService.d.ts.map