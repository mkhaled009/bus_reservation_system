import { Request, Response, NextFunction } from "express";
import { ReservationRepository } from "../repository";
const events = require("events");

const timerMap = new Map();

//create an object of EventEmitter class from events module
const myEmitter = new events.EventEmitter();
myEmitter.on("cleanUp", function (userId: string, token: string) {
  console.log("Username from Event : " + userId);
  const timerID = setTimeout(() => {
    ReservationRepository.query(
      'delete from reservation where "userId" = ' +
        userId +
        "and reservation.confirmed = false ;"
    );

    console.log(
      "unconfirmed reservations for user id :" +
        userId +
        " cancelled due to session expiration"
    );
  }, 120 * 1000);
  console.log("Timer ID : " + timerID);
  timerMap.set(token, timerID);
});

export const managereservation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.jwtPayload.userId;
  const token = <string>req.headers["auth"];
  myEmitter.emit("cleanUp", userId, token);
  next();
};

export const confirmreservation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = <string>req.headers["auth"];
  const timerID = timerMap.get(token);
  console.log("Tconfirmation  timer id : " + timerID);
  clearTimeout(timerID);

  next();
};
