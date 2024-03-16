import { Request, Response, NextFunction } from "express";

export const ErrorResponse = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) =>
  res.json({
    success: false,
    err
  });
