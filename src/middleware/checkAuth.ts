import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../utils";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["auth"];

  let jwtPayload;

  try {
    jwtPayload = jwt.verify(token, jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.status(401).send("session expired please login again ");
  }

  //const { userId, email } = jwtPayload;
  // const newToken = jwt.sign({ userId, email }, jwtSecret, {
  //   expiresIn: "1m",
  // });

  next();
};
