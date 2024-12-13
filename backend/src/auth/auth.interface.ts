/* eslint-disable prettier/prettier */
import { Request } from "express";
import { UserDocument } from "src/user/user.schema";
import { Session } from "express-session";

interface IUserSession extends Session {
    userId: string;
}

export interface IUsersRequest extends Request {
    user?: UserDocument,
    session: IUserSession,
}
