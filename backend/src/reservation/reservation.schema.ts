/* eslint-disable prettier/prettier */

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
    @Prop( { required: true, unique: true } )
    _id: Types.ObjectId;

    @Prop( { required: true } )
    userId: Types.ObjectId;

    @Prop( { required: true } )
    hotelId: Types.ObjectId;

    @Prop( { required: true } )
    roomId: Types.ObjectId;

    @Prop( { required: true } )
    dateStart: Date;

    @Prop( { required: true } )
    dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);