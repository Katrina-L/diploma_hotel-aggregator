/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Request, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles-auth.guards';
import { Roles } from 'src/guards/roles.decorator';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './reservation.interface';

//  Доступно только аутентифицированным пользователям с ролью client
@UseGuards(RolesGuard)
@Roles('client')
@Controller('api/client/reservations')
export class ReservationClientController {
    constructor( private readonly reservationService: ReservationService ) {}
    @Post()
    async createReservation( @Body() data: ReservationDto, @Request() req ) {
        data.userId = req.user._id;

        if ( !data.userId ) {
            throw new NotFoundException("Пользователь не найден");
        }
        
        const reserve = await this.reservationService.addReservation(data);
        return {
            startDate: reserve.dateStart,
            endDate: reserve.dateEnd,
            hotelRoom: {
              description: req.roomId.description,
              images: req.roomId.images,
            },
            hotel: {
              title: req.hotelId.title,
              description: req.hotelId.description,
            }
        };
        
        // return await this.reservationService.addReservation(data);
    }

    @Get()
    async getReservations( @Request() req ) {
        const filter = { userId: req.user._id };
        const reserves = await this.reservationService.getReservations( filter );

        return reserves.map( item => ({
            startDate: item.dateStart,
            endDate: item.dateEnd,
            hotelRoom: {
                description: req.roomId.description,
                images: req.roomId.images,
            },
            hotel: {
                title: req.hotelId.title,
                description: req.hotelId.description,
            }
        }) );
        // return await this.reservationService.getReservations( filter );
    }

    @Delete(":id")
    async removeReservation( @Param("id") id: string, @Request() req ) {
        const reserve = await this.reservationService.getReservations( {userId: req.user._id} );
        if ( !reserve.find( reserve => reserve._id.toString() === id ) ) {
            throw new NotFoundException("У вас нет такой брони");
        }

        return await this.reservationService.removeReservation(id);
    }
}

//  Доступно только аутентифицированным пользователям с ролью manager
@UseGuards(RolesGuard)
@Roles('manager')
@Controller('api/manager/reservations')
export class ReservationManagerController {
    constructor( private readonly reservationService: ReservationService ) {}

    @Get(":userId")
    async getReservationByManager( @Param("userId") userId: string, @Request() req ) {
        // const filter = { userId };
        const filter = req.body.userId;
        const reserves = await this.reservationService.getReservations(filter);

        return reserves.map( item => ({
            startDate: item.dateStart,
            endDate: item.dateEnd,
            hotelRoom: {
                description: req.roomId.description,
                images: req.roomId.images,
            },
            hotel: {
                title: req.hotelId.title,
                description: req.hotelId.description,
            }
        }) );
        // return await this.reservationService.getReservations(filter);
    }

    @Delete(":id")
    async removeReservationByManager( @Param("id") id: string ) {
        return await this.reservationService.removeReservation(id);
    }
}
