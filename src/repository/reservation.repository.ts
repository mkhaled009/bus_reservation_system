import { ReservationEntity } from "../entities";
import { DB } from "../utils";

export const ReservationRepository = DB.getRepository(ReservationEntity).extend(
  {}
);
