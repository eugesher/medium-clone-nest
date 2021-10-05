import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import connectionOptions from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...connectionOptions, autoLoadEntities: true }),
    TagsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
