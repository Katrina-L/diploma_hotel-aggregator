/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Hotel } from './hotel.schema';

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
    @Prop( { required: true } )
    hotel: Hotel;

    @Prop()
    description?: string

    @Prop()
    images?: string[];

    @Prop( { required: true, default: Date.now } )
    createdAt: Date;

    @Prop( { required: true, default: Date.now } )
    updatedAt: Date;

    @Prop( { required: true, default: true } )
    isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);