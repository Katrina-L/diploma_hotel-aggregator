/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { IHotelService, SearchHotelParams, UpdateHotelParams } from './hotel.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './hotel.schema';
import { Model } from 'mongoose';

@Injectable()
export class HotelsService implements IHotelService {
    constructor( @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>  ) {}

    async create( data: any ): Promise<Hotel> {
        const newHotel = new this.hotelModel(data);
        return newHotel.save();
    };

    async findById( id: string ): Promise<Hotel> {
        return this.hotelModel.findById(id).exec();
    };

    async search( params: SearchHotelParams ): Promise<Hotel[]> {
        const { limit, offset, title } = params;
        const query: any = {};

        if ( title ) {
            query.title = new RegExp(title, "i");
        }

        return this.hotelModel.find(query).skip(offset).limit(limit).exec();
    };

    async update( id: string, data: UpdateHotelParams ): Promise<Hotel> {
        return this.hotelModel.findByIdAndUpdate(id, data, { new: true }).exec();
    };
}
