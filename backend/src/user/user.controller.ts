/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { SearchUserParams } from './user.interface';

@Controller('users')
export class UserController {
    constructor ( private readonly userService: UserService ) {}

    @Post()
    async create( @Body() data: Partial<User> ): Promise<User> {
        return  this.userService.create(data);
    }

    @Get(":id")
    async findById( @Param("id") id: string ): Promise<User> {
        return this.userService.findById(id);
    }

    @Get()
    async findAll( @Query() query: SearchUserParams ): Promise<User[]> {
        return this.userService.findAll(query);
    }
}
