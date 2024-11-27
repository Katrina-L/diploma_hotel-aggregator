/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
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
        return this.userModel.findById(id).exec();
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne( {email} ).exec();
    }

    async findAll(params: SearchUserParams): Promise<User[]> {
        const { limit, offset, email, name, contactPhone } = params;
        const query: any = {};

        if ( email ) {
            query.email = new RegExp(email, "i");
        }

        if ( name ) {
            query.name = new RegExp(name, "i");
        }

        if ( contactPhone ) {
            query.contactPhone = new RegExp(contactPhone, "i");
        }

        return this.userModel.find(query).skip(offset).limit(limit).exec();
    }
}
