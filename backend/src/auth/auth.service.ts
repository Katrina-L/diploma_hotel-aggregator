/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    
    async validateuUser( email: string, password: string ): Promise<User> {
        const user = await this.userService.findByEmail(email);

        if ( !user ) {
            throw new UnauthorizedException("Пользователь не найден");
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if ( !isMatch ) {
            throw new UnauthorizedException("Неверный пароль");
        }

        return user;
    }
}
