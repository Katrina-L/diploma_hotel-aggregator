/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hotel } from './hotel.schema';

export type HotelRoomDocument = HotelRoom & Document;

@Schema()   //{ timestamps: true }
export class HotelRoom {
    @Prop( { required: true, unique: true } )
    _id: Types.ObjectId;
    
    @Prop( { type: String, required: true, ref: 'Hotel' } )
    // @Prop( { type: Types.ObjectId, ref: 'Hotel', required: true } )
    hotel: Hotel;

    @Prop()
    description?: string

    @Prop( { type: [String], default: [] } )
    images?: string[];

    @Prop( { required: true, default: Date.now } )  //  
    createdAt: Date;

    @Prop( { required: true, default: Date.now } )  //  
    updatedAt: Date;

    @Prop( { required: true, default: true } )
    isEnabled?: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);