/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GetChatListParams, ISupportRequestService, SendMessageDto } from './support-chat.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Message, SupportRequest, SupportRequestDocument } from './supportRequest.schema';
import { Model, Types } from 'mongoose';
import { EventEmitter } from 'stream';

@Injectable()
export class SupportChatService implements ISupportRequestService {
    constructor ( @InjectModel( SupportRequest.name ) private supportRequestModel: Model<SupportRequestDocument> ) {}
    private eventEmitter = new EventEmitter();
    
    async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
        const query = params.user ? { user: params.user, isActive: params.isActive } : { isActive: params.isActive };
        // const query = { isActive: params.isActive ?? true };
        // if ( params.user ) {
        //     query['user'] = params.user;
        // }
        return this.supportRequestModel.find(query).exec();
    };

    async sendMessage(data: SendMessageDto): Promise<Message> {
        const supportRequest = await this.supportRequestModel.findById(data.supportRequest);
        if ( !supportRequest ) {
            throw new Error("Запрос не найден");
        }

        const message = new Message();
        message._id = new Types.ObjectId();
        message.author = data.author;
        message.sentAt = new Date();
        message.text = data.text;

        supportRequest.messages.push(message);
        await supportRequest.save();

        this.eventEmitter.emit("message.sent", supportRequest, message);

        return message;
    };

    async getMessages(supportRequestId: Types.ObjectId): Promise<Message[]> {
        const supportRequest = await this.supportRequestModel.findById(supportRequestId).exec();

        if ( !supportRequest ) {
            throw new Error ("Запрос не найден");
        }

        return supportRequest.messages;
    };

    subscribe(
      handler: (supportRequest: SupportRequest, message: Message) => void
    ): () => void {
        this.eventEmitter.on("message.sent", handler);
        return () => this.eventEmitter.off("message.sent", handler);
    };
}
