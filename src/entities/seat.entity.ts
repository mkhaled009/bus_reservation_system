import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm";
import { IsNumber, IsNotEmpty } from "class-validator";
import { DestinationEntity } from "./destination.entity";

@Entity("seat")
export class SeatEntity {
  @Column()
  @IsNotEmpty()
  @IsNumber()
  @PrimaryColumn()
  busid: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  seatnumber: string;

  @ManyToOne(() => DestinationEntity, (destantion) => destantion.seats)
  destantion: DestinationEntity;
}
