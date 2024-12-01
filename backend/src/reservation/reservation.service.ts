/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { IReservation, ReservationDto, ReservationSearchOptions } from './reservation.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';

@Injectable()
export class ReservationService implements IReservation {
    constructor( @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>) {}

    async addReservation( data: ReservationDto ): Promise<Reservation> {
        
        if ( data.dateStart > data.dateEnd ) {
            throw new Error("Дата выезда должна быть позже даты заезда");
        }

        //  проверка на бронь
        const reserveExisted = await this.reservationModel.findOne({
            roomId: data.roomId,
            $or: [
                { dateStart: { $gte: data.dateStart, $lte: data.dateEnd } },
                { dateEnd: { $gte: data.dateStart,  $lte: data.dateEnd } },
                { dateStart: { $gte: data.dateStart }, dateEnd: { $lte: data.dateEnd } }
            ]
        }).exec();

        if ( reserveExisted ) {
            throw new Error("Есть бронь на указанные даты");
        }

        const newReservation = new this.reservationModel(data);
        return newReservation.save();
    };

    async removeReservation( id: ObjectId ): Promise<void> {
        await this.reservationModel.findByIdAndDelete(id).exec();
    };

    async getReservations( filter: ReservationSearchOptions ): Promise<Array<Reservation>> {
        return this.reservationModel.find(filter).exec();
    };
}
