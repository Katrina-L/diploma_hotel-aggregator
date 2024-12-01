/* eslint-disable prettier/prettier */
import { ObjectId } from "mongoose";
import { Reservation } from "./reservation.schema";

export interface ReservationDto {
    userId: ObjectId;
    hotelId: ObjectId;
    roomId: ObjectId;
    dateStart: Date;
    dateEnd: Date;
}

export interface ReservationSearchOptions {
    userId: ObjectId;
    dateStart: Date;
    dateEnd: Date;
}

export interface IReservation {
    addReservation( data: ReservationDto ): Promise<Reservation>;
    removeReservation( id: ObjectId ): Promise<void>;
    getReservations( filter: ReservationSearchOptions ): Promise<Array<Reservation>>;
}
