/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor( private reflector: Reflector ) {}
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        
        if ( !roles ) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if ( !request.isAuthenticated() ) {
            throw new UnauthorizedException("Пользователь не авторизован");
        }

        const user = request.user;
        
        const isRole = roles.includes(user.role);
        return isRole;
        // return matchRoles(roles, user.role);
    }
}