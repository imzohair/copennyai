import { Request, Response } from 'express';
import * as ruleEngineService from '../services/ruleEngineService';
import { z } from 'zod';

const ruleSchema = z.object({
  name: z.string().min(1),
  condition: z.any(),
  action: z.any(),
  is_active: z.boolean().optional()
});

export const getRules = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const rules = await ruleEngineService.getRules(userId);
    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
};

export const createRule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const data = ruleSchema.parse(req.body);
    const rule = await ruleEngineService.createRule(userId, {
      name: data.name,
      condition: data.condition,
      action: data.action,
      is_active: data.is_active ?? true
    });
    res.status(201).json(rule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Error creating rule:', error);
      res.status(500).json({ error: 'Failed to create rule' });
    }
  }
};

export const updateRule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const ruleId = parseInt(req.params.id as string, 10);
    const data = ruleSchema.partial().parse(req.body);

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.condition !== undefined) updateData.condition = data.condition;
    if (data.action !== undefined) updateData.action = data.action;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    const rule = await ruleEngineService.updateRule(ruleId, userId, updateData);
    if (!rule) {
      res.status(404).json({ error: 'Rule not found' });
      return;
    }
    res.json(rule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      console.error('Error updating rule:', error);
      res.status(500).json({ error: 'Failed to update rule' });
    }
  }
};

export const deleteRule = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const ruleId = parseInt(req.params.id as string, 10);

    const success = await ruleEngineService.deleteRule(ruleId, userId);
    if (!success) {
      res.status(404).json({ error: 'Rule not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({ error: 'Failed to delete rule' });
  }
};
