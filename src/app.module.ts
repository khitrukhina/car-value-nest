import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'node:process';
const cookieSession = require('cookie-session');
import { dataSourceOptions } from '../db/data-source';

@Module({
    imports: [
        UsersModule,
        ReportsModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        TypeOrmModule.forRoot(dataSourceOptions),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        ConfigService,
        {
            provide: APP_PIPE,
            // remove props which came with the req but were not listed in dto
            useValue: new ValidationPipe({ whitelist: true }),
        }
    ],
})
export class AppModule {
    constructor(private readonly configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieSession({
            keys: [this.configService.get('COOKIE_KEY')]
        })).forRoutes('*');
    }
}
