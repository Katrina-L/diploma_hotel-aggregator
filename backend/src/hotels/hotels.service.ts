/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { IHotelService, SearchHotelParams, UpdateHotelParams } from './hotel.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './hotel.schema';
import { Model } from 'mongoose';

@Injectable()
export class HotelsService implements IHotelService {
    constructor( @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument> ) {}

    async create( data: any ): Promise<Hotel> {
        const newHotel = new this.hotelModel(data);
        return await newHotel.save();
    };

    async findById( id: string ): Promise<Hotel> {
        const hotel = await this.hotelModel.findById(id).exec();

        if ( !hotel ) {
            throw new NotFoundException("Гостиница не найдена");
        }

        return hotel;
    };

    async search( params: SearchHotelParams ): Promise<Hotel[]> {
        const { limit, offset, title } = params;
        const query: any = {};

        if ( title ) {
            query["title"] = {$regex: title, $options: "i"};    // new RegExp(title, "i");
        }

        return await this.hotelModel.find(query).skip(offset).limit(limit).exec();
    };

    async update( id: string, data: UpdateHotelParams ): Promise<Hotel> {
        const hotel = await this.hotelModel.findByIdAndUpdate(id, data, { new: true }).exec();

        if ( !hotel ) {
            throw new NotFoundException("Гостиница не найдена");
        }
        return hotel;
    };
}
