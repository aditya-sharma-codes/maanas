import { Request, Response, NextFunction } from 'express';
import { loginInstitute } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await loginInstitute(email, password);
    return sendSuccess(res, 'Login successful', result);
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return sendError(res, error.message, [], 401);
    }
    next(error);
  }
};
