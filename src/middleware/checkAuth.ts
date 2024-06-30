import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};
