import { Request, Response, NextFunction } from 'express';
import { getDashboardStats, getDepartmentAnalysis } from '../services/dashboardService';
import { sendSuccess } from '../utils/response';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await getDashboardStats();
    return sendSuccess(res, 'Dashboard stats retrieved', stats);
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analysis = await getDepartmentAnalysis();
    return sendSuccess(res, 'Department analysis retrieved', analysis);
  } catch (error) {
    next(error);
  }
};
