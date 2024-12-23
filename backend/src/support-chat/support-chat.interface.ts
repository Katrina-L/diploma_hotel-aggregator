/* eslint-disable prettier/prettier */
import { Types } from "mongoose";
import { Message, SupportRequest } from "./supportRequest.schema";

export interface CreateSupportRequestDto {
    user: Types.ObjectId;
    text: string;
}
  
export interface SendMessageDto {
    author: Types.ObjectId;
    supportRequest: Types.ObjectId;
    text: string;
}

export interface MarkMessagesAsReadDto {
    user: Types.ObjectId;
    supportRequest: Types.ObjectId;
    createdBefore: Date;
}
  
export interface GetChatListParams {
    user: Types.ObjectId | null;
    isActive: boolean;
}
  
export interface ISupportRequestService {
    findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
    sendMessage(data: SendMessageDto): Promise<Message>;
    getMessages(supportRequest: Types.ObjectId): Promise<Message[]>;
    subscribe(
      handler: (supportRequest: SupportRequest, message: Message) => void
    ): () => void;
}
  
export interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
    markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
    getUnreadCount(supportRequest: Types.ObjectId): Promise<number>;   // Promise<Message[]>
}
  
export interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
    getUnreadCount(supportRequest: Types.ObjectId): Promise<number>;   // Promise<Message[]>
    closeRequest(supportRequest: Types.ObjectId): Promise<void>;
}