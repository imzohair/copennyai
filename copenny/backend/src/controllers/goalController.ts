import { Request, Response } from 'express';
import { z } from 'zod';
import * as goalService from '../services/goalService';

const goalSchema = z.object({
  name: z.string().min(1),
  target_amount: z.number().positive(),
  current_amount: z.number().min(0).optional(),
  deadline: z.string().optional(),
  color: z.string().optional(),
});

const progressSchema = z.object({
  current_amount: z.number().min(0)
});

export async function getGoals(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const goals = await goalService.getAllGoals(userId);
    
    // Add progress percentage to each goal
    const withProgress = goals.map(g => ({
      ...g,
      progress_percentage: goalService.calculateGoalProgress(g)
    }));

    res.json(withProgress);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
}

export async function createGoal(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const data = goalSchema.parse(req.body);
    const newGoal = await goalService.createGoal(userId, data as goalService.GoalInput);
    res.status(201).json(newGoal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
    } else {
      console.error('Error creating goal:', error);
      res.status(500).json({ error: 'Failed to create goal' });
    }
  }
}

export async function updateGoalProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const id = parseInt(req.params.id as string, 10);
    const data = progressSchema.parse(req.body);
    
    const updated = await goalService.updateGoalProgress(id, userId, data.current_amount);
    if (!updated) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
    } else {
      console.error('Error updating goal:', error);
      res.status(500).json({ error: 'Failed to update goal' });
    }
  }
}

export async function deleteGoal(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const id = parseInt(req.params.id as string, 10);
    
    const success = await goalService.deleteGoal(id, userId);
    if (!success) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
}
