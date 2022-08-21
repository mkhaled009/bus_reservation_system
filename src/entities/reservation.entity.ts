import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { UserEntity } from "./user.entity";
import { DestinationEntity } from "./destination.entity";

@Entity("reservation")
@Index(["seatnumber", "createdAt", "busid"], { unique: true })
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  ticketnumber: number;

  @IsNotEmpty()
  @Column()
  seatnumber: string;

  @Column()
  createdAt: string;

  @Column()
  cost: number;

  @Column()
  busid: number;

  @Column("boolean", { default: false })
  @IsNotEmpty()
  confirmed: boolean;

  @ManyToOne(() => UserEntity, (user) => user.reservations)
  user: UserEntity;

  @ManyToOne(() => DestinationEntity, (destination) => destination.reservations)
  destination: DestinationEntity;
}
