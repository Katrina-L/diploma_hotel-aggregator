/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './reservation.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Reservation.name, schema: ReservationSchema}]),
    ],
    providers: [ReservationService],
    exports: [ReservationService]
})
export class ReservationModule {}
