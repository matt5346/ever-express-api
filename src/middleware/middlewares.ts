import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err, "====== ERROR 400 =====");
  if (res.headersSent) {
    return next(err);
  }
  // Returning the status and error message to client
  res.status(400).send(err.message);
};
