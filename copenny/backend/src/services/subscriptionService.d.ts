export interface SubscriptionInput {
    name: string;
    amount: number;
    billing_cycle: 'monthly' | 'yearly' | 'weekly';
    next_billing_date: string;
    category?: string;
    status?: 'active' | 'inactive' | 'cancelled';
}
export declare function getAllSubscriptions(userId: number): Promise<any[]>;
export declare function getSubscriptionById(id: number, userId: number): Promise<any>;
export declare function createSubscription(userId: number, data: SubscriptionInput): Promise<any>;
export declare function updateSubscription(id: number, userId: number, data: Partial<SubscriptionInput>): Promise<any>;
export declare function deleteSubscription(id: number, userId: number): Promise<boolean>;
export declare function detectSubscriptions(userId: number): Promise<{
    name: any;
    amount: number;
    frequency: number;
    suggested_cycle: string;
}[]>;
//# sourceMappingURL=subscriptionService.d.ts.map