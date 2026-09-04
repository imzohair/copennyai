import { Request, Response } from 'express';
import { z } from 'zod';
import * as subscriptionService from '../services/subscriptionService';

const subscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  billing_cycle: z.enum(['monthly', 'yearly', 'weekly']),
  next_billing_date: z.string(),
  category: z.string().optional(),
  status: z.enum(['active', 'inactive', 'cancelled']).optional(),
});

const updateSubscriptionSchema = subscriptionSchema.partial();

export async function getSubscriptions(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const subscriptions = await subscriptionService.getAllSubscriptions(userId);
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
}

export async function createSubscription(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const data = subscriptionSchema.parse(req.body);
    const newSub = await subscriptionService.createSubscription(userId, data as subscriptionService.SubscriptionInput);
    res.status(201).json(newSub);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
    } else {
      console.error('Error creating subscription:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  }
}

export async function updateSubscription(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const id = parseInt(req.params.id as string, 10);
    const data = updateSubscriptionSchema.parse(req.body);
    
    const updated = await subscriptionService.updateSubscription(id, userId, data as Partial<subscriptionService.SubscriptionInput>);
    if (!updated) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
    } else {
      console.error('Error updating subscription:', error);
      res.status(500).json({ error: 'Failed to update subscription' });
    }
  }
}

export async function deleteSubscription(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const id = parseInt(req.params.id as string, 10);
    
    const success = await subscriptionService.deleteSubscription(id, userId);
    if (!success) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
}

export async function detectSubscriptions(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const potentials = await subscriptionService.detectSubscriptions(userId);
    res.json(potentials);
  } catch (error) {
    console.error('Error detecting subscriptions:', error);
    res.status(500).json({ error: 'Failed to detect subscriptions' });
  }
}
