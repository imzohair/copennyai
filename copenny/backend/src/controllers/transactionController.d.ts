import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
export declare const getTransactions: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTransactionHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTransactionHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTransactionHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const importCSVHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCategories: (_req: Request, res: Response) => Response<any, Record<string, any>>;
//# sourceMappingURL=transactionController.d.ts.map