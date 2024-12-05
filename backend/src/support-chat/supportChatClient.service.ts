/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { CreateSupportRequestDto, ISupportRequestClientService, MarkMessagesAsReadDto } from "./support-chat.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { SupportRequest, SupportRequestDocument } from "./supportRequest.schema";

@Injectable()
export class SupportChatClientService implements ISupportRequestClientService {
    constructor ( @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument> ) {}

    async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
        const supportRequest = new this.supportRequestModel({
            _id: new Types.ObjectId(),
            user: data.user,
            createdAt: new Date(),
            messages: [],
            isActive: true,
        });

        const message = {
            _id: new Types.ObjectId(),
            author: data.user,
            sentAt: new Date(),
            text: data.text,
            // readAt: 
        }

        supportRequest.messages.push(message);
        return supportRequest.save();
    };

    async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
        const supportRequest = await this.supportRequestModel.findById(params.supportRequest);

        if ( !supportRequest ) {
            throw new Error("Запрос не найден");
        }

        supportRequest.messages.forEach( message => {
            if ( !message.readAt && message.author.toString() !== params.user.toString() ) {
                message.readAt = new Date();
            }
        } );

        await supportRequest.save();
    };

    async getUnreadCount(supportRequestId: Types.ObjectId): Promise<number> {
        const supportRequest = await this.supportRequestModel.findById(supportRequestId);

        if ( !supportRequest ) {
            throw new Error("Запрос не нйаден");
        }

        return supportRequest.messages.filter( message => !message.readAt && message.author.toString() !== supportRequest.user.toString() ).length;
    };
}