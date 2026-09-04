export declare const CATEGORIES: readonly ['Housing', 'Food & Dining', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Education', 'Travel', 'Investment', 'Income', 'Other'];
export type Category = typeof CATEGORIES[number];
export declare function categorizeTransaction(description: string): Category;
export declare function ensureTransactionsTable(): Promise<void>;
export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    category?: string;
    type?: 'credit' | 'debit';
    limit?: number;
    offset?: number;
}
export declare function getAllTransactions(userId: number, filters?: TransactionFilters): Promise<{
    transactions: any[];
    total: number;
    limit: number;
    offset: number;
}>;
export declare function getTransactionById(id: number, userId: number): Promise<any>;
export interface TransactionInput {
    amount: number;
    type: 'credit' | 'debit';
    category?: string;
    description: string;
    date?: string;
    notes?: string;
}
export declare function createTransaction(userId: number, data: TransactionInput): Promise<any>;
export declare function updateTransaction(id: number, userId: number, data: Partial<TransactionInput>): Promise<any>;
export declare function deleteTransaction(id: number, userId: number): Promise<boolean>;
export interface CSVRow {
    date?: string;
    description?: string;
    amount?: string;
    type?: string;
    category?: string;
    notes?: string;
}
export declare function importCSV(userId: number, fileBuffer: Buffer): Promise<{
    imported: number;
    errors: string[];
}>;
//# sourceMappingURL=transactionService.d.ts.map