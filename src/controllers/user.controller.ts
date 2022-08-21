import { validate } from "class-validator";
import { Router, Response, Request } from "express";
import { commonConstants } from "../constants";
import { UserEntity } from "../entities";
import { checkAuth, checkRole } from "../middleware";
import { UserRepository } from "../repository";

export class UserController {
  public router: Router;
  private userRepository: typeof UserRepository;

  constructor() {
    this.userRepository = UserRepository;
    this.router = Router();
    this.routes();
  }

  public index = async (req: Request, res: Response) => {
    try {
      const users = await this.userRepository.find({
        select: {
          id: true,
          Email: true,
          role: true,
          reservations: {
            ticketnumber: true,
            destination: {
              name: true,

              available: true,
            },
          },
        },
        relations: {
          reservations: {
            destination: true,
          },
        },
        order: {
          reservations: {
            ticketnumber: "DESC",
          },
        },
      });
      return res.send(users);
    } catch (error) {
      return res.status(500).send(commonConstants.internalServerErrpr);
    }
  };

  public getOne = async (req: Request, res: Response) => {
    const id = req["params"]["id"];

    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          Email: true,
          role: true,
          reservations: {
            ticketnumber: true,
            destination: {
              name: true,
              available: true,
            },
          },
        },
        relations: {
          reservations: {
            destination: true,
          },
        },
        order: {
          reservations: {
            createdAt: "DESC",
          },
        },
      });

      return res.send(user);
    } catch (error) {
      return res.status(404).send("User not found");
    }
  };

  public create = async (req: Request, res: Response) => {
    const { emai, password } = req.body;
    const user = new UserEntity();
    user.Email = emai;
    user.password = password;
    user.role = "USER";

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();

    try {
      await this.userRepository.save(user);
    } catch (e) {
      res.status(409).send("Username already in use");
      return;
    }

    res.status(201).send("User created");
  };

  public routes() {
    this.router.get("/", [checkAuth, checkRole(["ADMIN"])], this.index);
    this.router.get("/:id", [checkAuth, checkRole(["ADMIN"])], this.getOne);
    this.router.post("/", this.create);
  }
}
