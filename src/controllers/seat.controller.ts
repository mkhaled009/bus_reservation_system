import { Router, Response, Request } from "express";
import { commonConstants } from "../constants";
import { SeatRepository } from "../repository";

export class SeatController {
  public router: Router;
  private seatRepository: typeof SeatRepository;

  constructor() {
    this.seatRepository = SeatRepository;
    this.router = Router();
    this.routes();
  }

  public index = async (req: Request, res: Response) => {
    try {

      const date = new Date();
      const createdAt = date.toLocaleDateString();
      const destinations = await this.seatRepository.query('select pickup , destination.name as destnation  , seat.busid as bus_number  , seatnumber , cost  from seat INNER JOIN destination ON "destantionId" = destination.id where (seatnumber , seat.busid) not in (select seatnumber  ,  busid from reservation where  "createdAt" =  '+"'"+createdAt +"'"+ ')');

   
      return res.send(destinations);
    } catch (error) {
      console.log(error)
      return res.status(500).send(commonConstants.internalServerErrpr);
    }
  };

  //  public routes() {
  //  this.router.get("/", [checkAuth, checkRole(["ADMIN", "USER"])], this.index);
  // }
  public routes() {
    this.router.get("/", this.index);
  }
}
