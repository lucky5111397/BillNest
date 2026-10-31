import { Router } from 'express';
import { getFinanceDashboardMetrics } from './reports.controller';

export const reportsRouter = Router();

reportsRouter.get('/dashboard', getFinanceDashboardMetrics);

