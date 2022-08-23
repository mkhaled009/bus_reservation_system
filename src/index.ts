import express, { Application } from "express";
import "reflect-metadata";
import { initDBWithData } from "./utils";
import {
  UserController,
  DestinationController,
  ReservationController,
  AuthController,
  SeatController,
} from "./controllers";
import cors from "cors";
import helmet from "helmet";

const port = process.env.PORT || 3000;

class Server {
  public express: Application;

  constructor() {
    this.express = express();
    this.configuration();
    this.start();
    this.routes();
  }


  public configuration() {
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(express.json());
  }

  public async routes() {
   /*  if (process.env.NODE_ENV !== "test") { */
      initDBWithData().then(() => {
        this.express.use(`/api/users/`, new UserController().router);
        this.express.use(`/api/Seats/`, new SeatController().router);
        this.express.use(`/api/Reservations/`,new ReservationController().router );
        this.express.use(`/api/destinations/`,new DestinationController().router);
        this.express.use(`/api/auth/`, new AuthController().router);
      });
  /*   } else {
      this.express.use(`/api/users/`, new UserController().router);
      this.express.use(`/api/Seats/`, new SeatController().router);
      this.express.use(`/api/Reservations/`,new ReservationController().router);
      this.express.use(`/api/destinations/`,new DestinationController().router);
      this.express.use(`/api/auth/`, new AuthController().router);
    } */
  }

  public start() {
    this.express.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  }

  
}

export default new Server().express;
