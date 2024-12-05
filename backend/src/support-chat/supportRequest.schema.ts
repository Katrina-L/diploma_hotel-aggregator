/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class Message {
    @Prop( { required: true, unique: true } )
    _id: Types.ObjectId;

    @Prop( { required: true } )
    author: Types.ObjectId;

    @Prop( { required: true } )
    sentAt: Date;

    @Prop( { required: true } )
    text: string;

    @Prop()
    readAt?: Date;
}

@Schema()
export class SupportRequest {
    @Prop( { required: true, unique: true } )
    _id: Types.ObjectId;

    @Prop( { required: true } )
    user: Types.ObjectId;

    @Prop( { required: true } )
    createdAt: Date;

    @Prop( { type: [Message] } )
    messages: Message[];

    @Prop()
    isActive: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);
export const MessageSchema = SchemaFactory.createForClass(Message);