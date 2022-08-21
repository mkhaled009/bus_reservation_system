import { validate } from "class-validator";
import e, { Router, Response, Request } from "express";
import { commonConstants } from "../constants";
import { ReservationEntity } from "../entities";
import { checkAuth } from "../middleware";
import { checkRole } from "../middleware";
import { Not } from "typeorm";
import { managereservation } from "../middleware";
import {
  ReservationRepository,
  UserRepository,
  DestinationRepository,
  SeatRepository,
} from "../repository";
const date = require("date-and-time");

export class ReservationController {
  public router: Router;
  private reservationRepository: typeof ReservationRepository;
  private userRepository: typeof UserRepository;
  private destinationRepository: typeof DestinationRepository;
  private seatrepository: typeof SeatRepository;

  constructor() {
    this.reservationRepository = ReservationRepository;
    this.userRepository = UserRepository;
    this.destinationRepository = DestinationRepository;
    this.seatrepository = SeatRepository;
    this.router = Router();
    this.routes();
  }



  public getfreq = async (req: Request, res: Response) => {
    try {
      const reservations = await this.reservationRepository.query(`
      select distinct on ("userId") "userId" , U."Email" , d.name from (SELECT "userId" , "destinationId" , count(*) as _count FROM reservation  GROUP BY "userId", "destinationId" ) a , public.destination d ,public."user" U where a."userId" = u.id and a."destinationId" =  d.id`);
      return res.send(reservations);
    } catch (error) {
      return res.status(500).send(commonConstants.internalServerErrpr);
    }
  };

  public getOne = async (req: Request, res: Response) => {
    const id = req["params"]["ticketnumber"];

    try {
      const reservation = await this.reservationRepository.findOneOrFail({
        where: {
          ticketnumber: Number(id),
        },
        relations: {
          destination: true,
        },
      });
      return res.send(reservation);
    } catch (error) {
      return res.status(400).send("Not found");
    }
  };

  public create = async (req: Request, res: Response) => {
    const { destination, seatnumbers } = req.body;


    const userId = res.locals.jwtPayload.userId;

    let user;
    try {
      user = await this.userRepository.findOneOrFail({
        where: {
          id: Number(userId),
        },
      });
    } catch (error) {
      res.status(400).send("Provide valid user for reservation");
      return;
    }

    let dest;
    try {
      dest = await this.destinationRepository.findOneOrFail({
        where: {
          name: String(destination),
        },
      });
    } catch (error) {
      res.status(400).send("Provide valid destination for reservation");
      return;
    }

    let runningreservation;
    try {
      runningreservation = await this.reservationRepository.find({
        relations: {
          user: true,
          destination: true,
        },
        where: {
          user: {
            id: Not(userId),
          },
          destination: {
            name: destination,
          },
          confirmed: false,
        },
      });

      if (runningreservation.length > 0) {
        res
          .status(400)
          .send("no avaliable sessions for reservation on this bus");
      }
    } catch (error) {
      res.status(400).send("no avaliable sessions for reservation on this bus");
      return;
    }

    var Allresult = [];
    var  discount = 0;
    if(seatnumbers.length > 5) discount = 10
    for (const seatnumber of seatnumbers){

    let seat;
    try {
      seat = await this.seatrepository.findOneOrFail({
        where: {
          seatnumber: String(seatnumber),
        },
      });
    
    const reservation = new ReservationEntity();
    reservation.cost = dest.cost- discount ;
    reservation.destination = dest;
    reservation.busid = dest.busid;
    reservation.seatnumber = seatnumber;
    const date = new Date();
    reservation.createdAt = date.toLocaleDateString();
    reservation.confirmed = false;
    reservation.user = user;

    const errors = await validate(reservation);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

   
      await this.reservationRepository.save(reservation);
      const result: any = {
        ticketnumber: reservation.ticketnumber,
        destination: reservation.destination.name,
        seatnumber: reservation.seatnumber,
        coast: reservation.cost,
        email: reservation.user.Email,
        Status: "pinding Confirmation!",
      };

    Allresult.push(result)
      }
    catch (e) {
      const result: any = {
        seatnumber: seatnumber,
        Status: "reservation failed , seat taken  or not valid ",
      };
      Allresult.push(result)
    }
  }
  res.status(201).send(Allresult);
  };

  public confirm = async (req: Request, res: Response) => {
    const { ticketnumbers, confirmed } = req.body;
    const userId = res.locals.jwtPayload.userId;
    let reservation;
      for (const ticketnumber of ticketnumbers){
        try {
          
          reservation = await this.reservationRepository.findOneOrFail({
            relations: {
              user: true,
            },
            where: {
              ticketnumber: Number(ticketnumber),
            },
          });

          if (reservation.user.id != userId) {
            res.status(404).send("reservation not found : ticket number " + ticketnumber);
          }
    } catch (error) {
      res.status(404).send("reservation not found : ticket number " + ticketnumber);
      return;
    }
    reservation.confirmed = confirmed;

    try {
      await this.reservationRepository.save(reservation);
    } catch (e) {
      res.status(400).send("Could not update reservation");
      return;
    }
  }
    res.status(204).send();
  };


  public routes() {
    this.router.get(
      "/getfreq",
      [checkAuth, checkRole(["ADMIN", "USER"])],
      this.getfreq
    );
    this.router.get(
      "/:id",
      [checkAuth, checkRole(["ADMIN", "USER"])],
      this.getOne
    );
    this.router.post(
      "/",
      [checkAuth, checkRole(["ADMIN", "USER"])],
      managereservation,
      this.create
    );
    this.router.post(
      "/confirm",
      [checkAuth, checkRole(["ADMIN", "USER"])],
      this.confirm
    );
  }
}
