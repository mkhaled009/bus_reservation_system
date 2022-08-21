import { SeatEntity } from "../entities";

import { DB } from "../utils";

export const SeatRepository = DB.getRepository(SeatEntity).extend({});
