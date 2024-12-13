/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop( { required: true, unique: true } )
    _id: Types.ObjectId;
    
    @Prop( { required: true, unique: true } )
    email: string;

    @Prop ( { required: true } )
    passwordHash: string;

    @Prop ( { required: true } )
    name: string;

    @Prop ()
    contactPhone?: string;

    @Prop ( { required: true, default: "client", enum: ["client", "admin", "manager"] } )
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);