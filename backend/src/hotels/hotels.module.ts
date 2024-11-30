/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './hotel.schema';
import { HotelRoom, HotelRoomSchema } from './hotel-room.schema';
import { HotelRoomService } from './hotel-room.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Hotel.name, schema: HotelSchema },
            { name: HotelRoom.name, schema: HotelRoomSchema },
        ])
    ],
    providers: [HotelsService, HotelRoomService],
    // exports: [HotelsService, HotelRoomService],
})
export class HotelsModule {}