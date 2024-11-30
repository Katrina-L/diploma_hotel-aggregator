/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
    @Prop( { require: true } )
    title: string;

    @Prop()
    description?: string;

    @Prop( { required: true, default: Date.now } )
    createdAt: Date;

    @Prop( { required: true, default: Date.now } )
    updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);