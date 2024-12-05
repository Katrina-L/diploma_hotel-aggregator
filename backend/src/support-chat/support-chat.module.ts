/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SupportChatService } from './support-chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestSchema } from './supportRequest.schema';
import { SupportChatClientService } from './supportChatClient.service';
import { SupportChatEmployeeService } from './supportChatEmployee.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: SupportRequest.name, schema: SupportRequestSchema}
        ])
    ],
    providers: [SupportChatService],
    exports: [
        SupportChatClientService, SupportChatEmployeeService
    ]
})
export class SupportChatModule {}
