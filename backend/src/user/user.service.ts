/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { IUserService, SearchUserParams } from './user.interface';
import { Model } from 'mongoose';

@Injectable()
export class UserService implements IUserService {
    constructor (
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(data: Partial<User>): Promise<User> {
        const newUser = new this.userModel(data);
        return newUser.save();
    }

    async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();

        if ( !user ) {
            throw new NotFoundException (`Пользователь с id ${id} не найден`); 
            // throw new Error(`Пользователь с id ${id} не найден`);
        }
        
        return  user;
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne( {email} ).exec();
    }

    async findAll(params: SearchUserParams): Promise<User[]> {
        const { limit, offset, email, name, contactPhone } = params;
        const query: any = {};

        if ( email ) {
            query["email"] = {$regex: email, $options: "i"};
        }

        if ( name ) {
            query["name"] = {$regex: name, $options: "i"};
        }

        if ( contactPhone ) {
            query["contactPhone"] = {$regex: contactPhone, $options: "i"};
        }

        return this.userModel.find(query).skip(offset).limit(limit).exec();
    }
}
