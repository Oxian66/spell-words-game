import { SpellWordsGateway } from './spell_words.gateway';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordSchema } from './entities/word.entity';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017/spell_words'),
    // MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, SpellWordsGateway],
})
export class AppModule {}
