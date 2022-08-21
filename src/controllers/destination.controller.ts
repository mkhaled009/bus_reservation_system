import { Router, Response, Request } from "express";
import { commonConstants } from "../constants";
import { DestinationRepository } from "../repository";

export class DestinationController {
  public router: Router;
  private destinationRepository: typeof DestinationRepository;

  constructor() {
    this.destinationRepository = DestinationRepository;
    this.router = Router();
    this.routes();
  }

  public index = async (req: Request, res: Response) => {
    try {
      const destinations = await this.destinationRepository.find({
        order: {
          id: "DESC",
          seats: {
            seatnumber: "DESC",
          },
        },
        relations: {
          seats: true,
        },
      });
      return res.send(destinations);
    } catch (error) {
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
