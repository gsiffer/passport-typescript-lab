import { Request, Response, NextFunction } from "express";

export const ensureAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "admin") {
    next()
  } else {
    res.redirect("/dashboard");
  }
}