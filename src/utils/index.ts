import "dotenv/config";
import { DataSourceOptions, DataSource } from "typeorm";
import {
  ReservationEntity,
  DestinationEntity,
  UserEntity,
  SeatEntity,
} from "../entities";

const connectOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_INSTANCE,
  synchronize: true,
  entities: [
    process.env.NODE_ENV === "prod"
      ? "build/**/*.entity{,.js}"
      : "src/**/*.entity{.ts,.js}",
  ],
  migrations: ["src/migration/*.ts"],
};

export const DB = new DataSource(connectOptions);

export const initDB = async () => {
  const db = await DB.initialize();

  return db;
};

export const initDBWithData = async () => {
  const db = await DB.initialize();

  await clearDB();

  await createAdmin();

  await createDestination();

  //await CreateBuses();

  return db;
};

export const initDBWithAdmin = async () => {
  const db = await DB.initialize();

  await clearDB();

  await createAdmin();

  return db;
};

export const clearDB = async () => {
  const entities = DB.entityMetadatas;
  for (const entity of entities) {
    const repository = await DB.getRepository(entity.name);
    await repository.query(
      `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`
    );
  }
};

export const createAdmin = async () => {
  const user = new UserEntity();
  user.Email = "admin@bRS.com";
  user.password = "admin";
  user.hashPassword();
  user.role = "ADMIN";

  const user2 = new UserEntity();
  user2.Email = "user@bRS.com";
  user2.password = "admin";
  user2.hashPassword();
  user2.role = "USER";

  await DB.getRepository(UserEntity).save(user);

  await DB.getRepository(UserEntity).save(user2);

  return user;
};

export const createDestination = async () => {
  const destination = new DestinationEntity();
  destination.pickup = "cairo";
  destination.name = "alex";
  destination.cost = 100;
  destination.available = true;
  destination.triptype = "Short trip";
  destination.busid = 1;

  const destination2 = new DestinationEntity();
  destination2.pickup = "cairo";
  destination2.name = "aswan";
  destination2.cost = 200;
  destination2.available = true;
  destination2.triptype = "Long trip";
  destination2.busid = 2;

  await DB.getRepository(DestinationEntity).save(destination);
  await DB.getRepository(DestinationEntity).save(destination2);

  const seats: SeatEntity[] = [
    { busid: 1, seatnumber: "A1", destantion: destination },
    { busid: 1, seatnumber: "A2", destantion: destination },
    { busid: 1, seatnumber: "A3", destantion: destination },
    { busid: 1, seatnumber: "A4", destantion: destination },
    { busid: 1, seatnumber: "A5", destantion: destination },
    { busid: 1, seatnumber: "A6", destantion: destination },
    { busid: 1, seatnumber: "A7", destantion: destination },
    { busid: 1, seatnumber: "A8", destantion: destination },
    { busid: 1, seatnumber: "A9", destantion: destination },
    { busid: 1, seatnumber: "A10", destantion: destination },
    { busid: 1, seatnumber: "B1", destantion: destination },
    { busid: 1, seatnumber: "B2", destantion: destination },
    { busid: 1, seatnumber: "B3", destantion: destination },
    { busid: 1, seatnumber: "B4", destantion: destination },
    { busid: 1, seatnumber: "B5", destantion: destination },
    { busid: 1, seatnumber: "B6", destantion: destination },
    { busid: 1, seatnumber: "B7", destantion: destination },
    { busid: 1, seatnumber: "B8", destantion: destination },
    { busid: 1, seatnumber: "B9", destantion: destination },
    { busid: 1, seatnumber: "B10", destantion: destination },
    { busid: 2, seatnumber: "A1", destantion: destination2 },
    { busid: 2, seatnumber: "A2", destantion: destination2 },
    { busid: 2, seatnumber: "A3", destantion: destination2 },
    { busid: 2, seatnumber: "A4", destantion: destination2 },
    { busid: 2, seatnumber: "A5", destantion: destination2 },
    { busid: 2, seatnumber: "A6", destantion: destination2 },
    { busid: 2, seatnumber: "A7", destantion: destination2 },
    { busid: 2, seatnumber: "A8", destantion: destination2 },
    { busid: 2, seatnumber: "A9", destantion: destination2 },
    { busid: 2, seatnumber: "A10", destantion: destination2 },
    { busid: 2, seatnumber: "B1", destantion: destination2 },
    { busid: 2, seatnumber: "B2", destantion: destination2 },
    { busid: 2, seatnumber: "B3", destantion: destination2 },
    { busid: 2, seatnumber: "B4", destantion: destination2 },
    { busid: 2, seatnumber: "B5", destantion: destination2 },
    { busid: 2, seatnumber: "B6", destantion: destination2 },
    { busid: 2, seatnumber: "B7", destantion: destination2 },
    { busid: 2, seatnumber: "B8", destantion: destination2 },
    { busid: 2, seatnumber: "B9", destantion: destination2 },
    { busid: 2, seatnumber: "B10", destantion: destination2 },
  ];

  await DB.getRepository(SeatEntity).save(seats);

  return destination;
};

export const createReservation = async (
  user: UserEntity,
  destination: DestinationEntity
) => {
  const reservation = new ReservationEntity();

  reservation.createdAt = "2022-08-16T00:15:23.138Z";

  reservation.cost = destination.cost;
  reservation.user = user;
  reservation.destination = destination;

  await DB.getRepository(ReservationEntity).save(reservation);

  return reservation;
};

export const clearreservation = async () => {
  const reservationRepository = await DB.getRepository(ReservationEntity);
  await reservationRepository.query(
    `TRUNCATE "reservation" RESTART IDENTITY CASCADE;`
  );
};

export const clearDestinations = async () => {
  const destinationRepository = await DB.getRepository(DestinationEntity);
  await destinationRepository.query(
    `TRUNCATE "destination" RESTART IDENTITY CASCADE;`
  );
};

export const dropDB = async () => {
  await DB.destroy();
};

export const jwtSecret = process.env.JWT_SECRET as string;
