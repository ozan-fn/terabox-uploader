import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET!;

export const auth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];
	if (!token) return res.sendStatus(401);
	try {
		jwt.verify(token, SECRET);
		next();
	} catch (error) {
		res.sendStatus(401);
	}
};
