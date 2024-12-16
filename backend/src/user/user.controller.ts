/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { SearchUserParams } from './user.interface';
import * as bcrypt from 'bcrypt';
import { RolesGuard } from 'src/guards/roles-auth.guards';
import { Roles } from 'src/guards/roles.decorator';

//  Доступно только пользователям с ролью admin
@UseGuards(RolesGuard)
@Roles("admin")
@Controller('api/admin/users')
export class UserController {
    constructor ( private readonly userService: UserService ) {}

    @Post()
    async create( @Body() data: { 
        email: string, 
        password: string, 
        name: string,
        contactPhone?: string;
        role?: string
    } ): Promise<{ id: string, email: string, name: string, contactPhone?: string, role: string }> {
        const { email, password, name, contactPhone, role } = data;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await this.userService.create( {
            email,
            passwordHash, 
            name, 
            contactPhone, 
            role
        } );

        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone,
            role: user.role,
        }
    }
    
    @Get(":id")
    async findById( @Param("id") id: string ): Promise<User> {
        return await this.userService.findById(id);
    }
    
    @Get()
    async findAll( @Query() query: SearchUserParams ) {
        const params: SearchUserParams = {
            limit: query.limit,
            offset: query.offset,
            email: query.email,
            name: query.name,
            contactPhone: query.contactPhone,
        }
        return await this.userService.findAll(params);
    }
}

//  Доступно только пользователям с ролью manager
@UseGuards(RolesGuard)
@Roles("manager")
@Controller('api/manager/users')
export class ManagerUserController {
    constructor( private readonly userService: UserService ) {}

    @Get()
    async findAll( @Query() query: SearchUserParams ) {
        const params: SearchUserParams = {
            limit: query.limit,
            offset: query.offset,
            email: query.email,
            name: query.name,
            contactPhone: query.contactPhone,
        }
        return await this.userService.findAll(params);
    }
}
