/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth/auth.service";
import { User } from "src/user/user.schema";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy (Strategy) {
    constructor( private readonly authService: AuthService ) {
        super( { usernameField: "email" } )
    }

    async validate( email: string, password: string ): Promise<User> {
        return this.authService.validateuUser( email, password );
    }
}