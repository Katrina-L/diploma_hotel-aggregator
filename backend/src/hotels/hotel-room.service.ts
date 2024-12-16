/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { IHotelRoomService, SearchRoomParams } from "./hotel.interface";
import { InjectModel } from "@nestjs/mongoose";
import { HotelRoom, HotelRoomDocument } from "./hotel-room.schema";
import { Model } from "mongoose";

@Injectable()
export class HotelRoomService implements IHotelRoomService {
    constructor ( @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument> ) {}

    async create( data: Partial<HotelRoom> ): Promise<HotelRoom> {
        const newHotelRoom = new this.hotelRoomModel(data);
        return await newHotelRoom.save();
    };

    async findById( id: string ): Promise<HotelRoom> {
        return await this.hotelRoomModel.findById(id).populate("hotel").exec();
    };

    async search( params: SearchRoomParams ): Promise<HotelRoom[]> {
        const { limit, offset, hotel, isEnabled } = params;
        const query = { hotel };

        if ( isEnabled !== undefined ) {
            query["isEnabled"] = isEnabled;
        }

        return await this.hotelRoomModel.find(query).skip(offset).limit(limit).populate("hotel").exec();
    };

    async update( id: string, data: Partial<HotelRoom> ): Promise<HotelRoom> {
        return await this.hotelRoomModel.findByIdAndUpdate(id, data, { new: true }).exec();
    };
}