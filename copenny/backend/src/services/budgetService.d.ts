export interface BudgetInput {
    category: string;
    limit_amount: number;
    spent_amount?: number;
    month: string;
}
export declare function getAllBudgets(userId: number, month?: string): Promise<any[]>;
export declare function getBudgetById(id: number, userId: number): Promise<any>;
export declare function createBudget(userId: number, data: BudgetInput): Promise<any>;
export declare function updateBudget(id: number, userId: number, data: Partial<BudgetInput>): Promise<any>;
export declare function deleteBudget(id: number, userId: number): Promise<boolean>;
//# sourceMappingURL=budgetService.d.ts.map