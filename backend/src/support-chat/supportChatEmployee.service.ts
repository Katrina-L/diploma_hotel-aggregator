/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ISupportRequestEmployeeService, MarkMessagesAsReadDto } from "./support-chat.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { SupportRequest, SupportRequestDocument } from "./supportRequest.schema";

@Injectable()
export class SupportChatEmployeeService implements ISupportRequestEmployeeService {
    constructor ( @InjectModel( SupportRequest.name ) private supportRequestModel: Model<SupportRequestDocument> ) {}
    
    //  должен выставлять текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены пользователем
    async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {  
        const supportRequest = await this.supportRequestModel.findById(params.supportRequest);

        if ( !supportRequest ) {
            throw new Error("Запрос не найден");
        }

        supportRequest.messages.forEach( massege => {
           if ( !massege.readAt && massege.author.toString() === params.user.toString() ) {
            massege.readAt = new Date();
           }
        });

        await supportRequest.save();
    };
    
    //  должен возвращать количество сообщений, которые были отправлены пользователем и не отмечены прочитанными.
    async getUnreadCount(supportRequestId: Types.ObjectId): Promise<number> {   
        const supportRequest = await this.supportRequestModel.findById(supportRequestId);

        if ( !supportRequest ) {
            throw new Error("Запрос не найден");
        }

        return supportRequest.messages.filter( message => !message.readAt && message.author.toString() === supportRequest.user.toString() ).length;
    };
    
    //  должен менять флаг isActive на false
    async closeRequest(supportRequestId: Types.ObjectId): Promise<void> {   
        const supportRequest = await this.supportRequestModel.findById(supportRequestId);

        if ( !supportRequest ) {
            throw new Error("Запрос не найден");
        }

        supportRequest.isActive = false;
        await supportRequest.save();
    };
}