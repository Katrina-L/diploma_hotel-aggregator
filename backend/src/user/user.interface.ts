/* eslint-disable prettier/prettier */
import { User } from './user.schema';

export interface SearchUserParams {
    limit: number;
    offset: number;
    email: string;
    name: string;
    contactPhone: string;
}

export interface IUserService {
    create(data: Partial<User>): Promise<User>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findAll(params: SearchUserParams): Promise<User[]>;
}