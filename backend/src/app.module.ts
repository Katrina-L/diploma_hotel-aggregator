/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),   //  "mongodb://localhost/hotel-aggregator"
    UserModule, HotelsModule,
],
})
export class AppModule {}
