import { Request, Response } from 'express';
import { z } from 'zod';
import * as budgetService from '../services/budgetService';

const budgetSchema = z.object({
  category: z.string().min(1),
  limit_amount: z.number().positive(),
  spent_amount: z.number().min(0).optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Must be YYYY-MM format"),
});

const updateBudgetSchema = budgetSchema.partial();

export async function getBudgets(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const month = req.query.month as string | undefined;
    const budgets = await budgetService.getAllBudgets(userId, month);
    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
}

export async function createBudget(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const data = budgetSchema.parse(req.body);
    const newBudget = await budgetService.createBudget(userId, data as budgetService.BudgetInput);
    res.status(201).json(newBudget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
    } else if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
    } else {
      console.error('Error creating budget:', error);
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }
}

export async function updateBudget(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const id = parseInt(req.params.id as string, 10);
    const data = updateBudgetSchema.parse(req.body);
    
    const updated = await budgetService.updateBudget(id, userId, data as Partial<budgetService.BudgetInput>);
    if (!updated) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
    } else {
      console.error('Error updating budget:', error);
      res.status(500).json({ error: 'Failed to update budget' });
    }
  }
}

export async function deleteBudget(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const id = parseInt(req.params.id as string, 10);
    
    const success = await budgetService.deleteBudget(id, userId);
    if (!success) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
}
