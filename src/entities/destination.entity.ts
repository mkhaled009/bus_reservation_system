import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { IsNumber, IsNotEmpty, IsString, IsBoolean } from "class-validator";
import { ReservationEntity } from "./reservation.entity";
import { SeatEntity } from "./seat.entity";

@Entity("destination")
@Unique(["name"])
export class DestinationEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsString()
  pickup: string;
  @Column()
  @IsString()
  name: string;

  @Column("text")
  @IsString()
  triptype: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  busid: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @Column("boolean", { default: true })
  @IsBoolean()
  available?: boolean = true;

  @OneToMany(
    () => ReservationEntity,
    (reservation) => reservation.destination,
    {}
  )
  reservations: ReservationEntity[];

  @OneToMany(() => SeatEntity, (seat) => seat.destantion)
  seats: SeatEntity[];
}
