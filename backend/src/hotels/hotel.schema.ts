/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';//, Types

export type HotelDocument = Hotel & Document;

@Schema()   //{ timestamps: true }
export class Hotel {
    @Prop( { required: true, unique: true } )
    _id: Types.ObjectId;
    
    @Prop( { require: true } )
    title: string;

    @Prop()
    description?: string;

    @Prop( { required: true, default: Date.now } )  //
    private createdAt: Date;

    @Prop( { required: true, default: Date.now } )  //
    private updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);