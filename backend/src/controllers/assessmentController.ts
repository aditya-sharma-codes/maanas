import { Request, Response, NextFunction } from 'express';
import { submitAssessment } from '../services/assessmentService';
import { sendSuccess } from '../utils/response';

export const createAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const result = await submitAssessment(data);
    return sendSuccess(res, 'Assessment submitted successfully', result, 201);
  } catch (error) {
    next(error);
  }
};
