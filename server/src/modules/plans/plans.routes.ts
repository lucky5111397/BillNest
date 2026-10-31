import { Router } from 'express';
import { listPlans, getPlanById, createPlan, updatePlan, deletePlan } from './plans.controller';

export const plansRouter = Router();

plansRouter.get('/', listPlans);
plansRouter.get('/:id', getPlanById);
plansRouter.post('/', createPlan);
plansRouter.put('/:id', updatePlan);
plansRouter.delete('/:id', deletePlan);
