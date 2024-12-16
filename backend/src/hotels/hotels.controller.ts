/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles-auth.guards';
import { Roles } from 'src/guards/roles.decorator';
import { HotelsService } from './hotels.service';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoom } from './hotel-room.schema';
import { SearchHotelParams, SearchRoomParams, UpdateHotelParams } from './hotel.interface';
import { User } from 'src/user/user.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

//  Доступно всем пользователям, включая неаутентифицированных.
@Controller('api/common/hotel-rooms')
export class HotelRoomsController {
    constructor(private readonly hotelRoomService: HotelRoomService ) {}

    @Get()  // 2.1.1.
    async search( 
        @Query() query: SearchRoomParams, 
        @Req() req: Express.Request & { user: User }
    ): Promise<HotelRoom[]> {
        const params = {
            limit: query.limit = 10,
            offset: query.offset = 0,
            hotel: query.hotel,
            isEnabled: query.isEnabled === true ? true : undefined
        }

        if ( !req.isAuthenticated() || req?.user?.role === "client" ) {
            params.isEnabled = true;
        }

        return await this.hotelRoomService.search(params);
    }

    @Get(':id') //2.1.2.
    async findById( @Param("id") id: string ): Promise<HotelRoom> {
        return await this.hotelRoomService.findById(id);
    }
}

//  Доступно только аутентифицированным пользователям с ролью admin
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('api/admin/hotels')
export class HotelsController {
    constructor( private readonly hotelsService: HotelsService ) {}

    @Post() //2.1.3.
    async create( @Body() data: { title: string, description?: string } ) {
        const newHotel = await this.hotelsService.create(data);
        return {
            id: newHotel._id,
            title: newHotel.title,
            description: newHotel.description
        };
    }

    @Get()  //2.1.4.
    async findAll( @Query() query: SearchHotelParams ) {
        const params = {
            limit: query.limit = 10,
            offset: query.offset = 0,
        }

        const hotels = await this.hotelsService.search(params);

        return hotels.map( hotel => ({
            id: hotel._id,
            title: hotel.title,
            description: hotel.description,
        }) );
    }

    @Put(':id') //2.1.5.
    async update( @Param("id") id: string, @Body() data: UpdateHotelParams ) {
        const hotel = await this.hotelsService.update(id, data);
        return {
            id: hotel._id,
            title: hotel.title,
            description: hotel.description,
        };
    }
}

@UseGuards(RolesGuard)
@Roles('admin')
@Controller('api/admin/hotel-rooms')
export class HotelRoomController {
    constructor(private readonly hotelRoomService: HotelRoomService) {}
    
    @Post() //2.1.6
    @UseInterceptors(FileFieldsInterceptor([
        { name: "images", maxCount: 10 },
    ]))

    async create( 
        @Body() data: {hotelId: string, description: string}, 
        @UploadedFiles() files: { images?: Express.Multer.File[] } ): Promise<HotelRoom> {
            // const { hotelId, description } = data;

            // return await this.hotelRoomService.create({
            //     description,
            //     hotel: hotelId,
            //     images: files.images ? files.images.map( img => img.filename ) : [],
            //     isEnabled: true,
            // });
            return await this.hotelRoomService.create( { ...data, images: files.images ? files.images.map( img => img.filename ) : [], isEnabled: true } )
    }

    @Put(":id")
    @UseInterceptors(FileFieldsInterceptor([
        { name: "images", maxCount: 10 },
    ]))

    async update( 
        @Param("id") id: string, 
        @UploadedFiles() files: { images?: Express.Multer.File[] }, 
        @Body() data: { hotelId: string, description: string, isEnabled: boolean } ): Promise<HotelRoom> {
            // const { hotelId, description, isEnabled } = data;

            // return await this.hotelRoomService.update( id, {
            //     hotel: hotelId,
            //     description,
            //     images: files.images ? files.images.map( img => img.filename ) : [],
            //     isEnabled
            // } )

            return await this.hotelRoomService.update( id, { ...data, images: files.images ? files.images.map( img => img.filename ) : [] } );
        }
}

