export interface GoalInput {
    name: string;
    target_amount: number;
    current_amount?: number;
    deadline?: string;
    color?: string;
}
export declare function getAllGoals(userId: number): Promise<any[]>;
export declare function getGoalById(id: number, userId: number): Promise<any>;
export declare function createGoal(userId: number, data: GoalInput): Promise<any>;
export declare function updateGoalProgress(id: number, userId: number, currentAmount: number): Promise<any>;
export declare function deleteGoal(id: number, userId: number): Promise<boolean>;
export declare function calculateGoalProgress(goal: {
    target_amount: string | number;
    current_amount: string | number;
}): number;
//# sourceMappingURL=goalService.d.ts.map