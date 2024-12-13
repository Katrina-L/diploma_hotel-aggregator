/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Request } from "express";
import { IUsersRequest } from "src/auth/auth.interface";

@Injectable()
export class LocalUnauthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request: IUsersRequest = context.switchToHttp().getRequest();
        return !request.session.userId;
    }
}
