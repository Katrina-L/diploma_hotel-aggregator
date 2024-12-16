/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';//
import { IReservation, ReservationDto, ReservationSearchOptions } from './reservation.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';

@Injectable()
export class ReservationService implements IReservation {
    constructor( @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>) {}

    async addReservation( data: ReservationDto ): Promise<Reservation> {
        
        //  проверка на даты
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
            throw new ForbiddenException("Есть бронь на указанные даты");
        }

        const newReservation = new this.reservationModel(data);
        return await newReservation.save();
    };

    async removeReservation( id: string ): Promise<void> {
        const reserve = await this.reservationModel.findByIdAndDelete(id).exec();
        if ( !reserve ) {
            throw new NotFoundException("Бронь не найдена");
        }
    };

    async getReservations( filter: ReservationSearchOptions ): Promise<Array<Reservation>> {
        return await this.reservationModel.find(filter).exec();
    };
}
