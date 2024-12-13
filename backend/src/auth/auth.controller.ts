/* eslint-disable prettier/prettier */
import { Controller, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { LocalUnauthGuard } from '../guards/local-unauth.guard';
import { IUsersRequest } from './auth.interface';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    // Доступно только не аутентифицированным пользователям
    @UseGuards(LocalUnauthGuard)
    @Post('login')
    async login( @Req() req: IUsersRequest, @Res() res: Response ) {
        const user = req.user;
        req.session.userId = user._id.toString();

        return res.json({
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone,
        });
    }

    // Доступно только аутентифицированным пользователям
    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout( @Req() req: IUsersRequest, @Res() res: Response ) {
        req.session.destroy( (err: any) => {

            if ( err ) {
                return res.status(500).send("Ошибка при выходе");
            }
            
            res.clearCookie('connect.sid');
            return res.status(204).send();
        } )
    }

    // Доступно только не аутентифицированным пользователям
    @UseGuards(LocalUnauthGuard)
    @Post('register')
    async register( @Body() data: { 
            email: string, 
            password: string, 
            name: string, 
            contactPhone: string 
        } ) {
        const { email, password, name, contactPhone } = data;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.userService.create( {
            email,
            passwordHash,
            name,
            contactPhone,
            role: "client",
        } );

        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        };
    }
}

