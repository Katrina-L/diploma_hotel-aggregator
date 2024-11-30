/* eslint-disable prettier/prettier */

import { HotelRoom } from "./hotel-room.schema";
import { Hotel } from "./hotel.schema";

export interface SearchHotelParams {
    limit: number;
    offset: number;
    title: string;
}

export interface UpdateHotelParams {
    title: string;
    description: string;
}

export interface IHotelService {
    create( data: any ): Promise<Hotel>;
    findById( id: string ): Promise<Hotel>;
    search( params: SearchHotelParams ): Promise<Hotel[]>;
    update( id: string, data: UpdateHotelParams ): Promise<Hotel>;
}

export interface SearchRoomParams {
    limit: number;
    offset: number;
    hotel: string;
    isEnabled?: boolean;
}

export interface IHotelRoomService {
    create( data: Partial<HotelRoom> ): Promise<HotelRoom>;
    findById( id: string ): Promise<HotelRoom>;
    search( params: SearchRoomParams ): Promise<HotelRoom[]>;
    update( id: string, data: Partial<HotelRoom> ): Promise<HotelRoom>;
}
