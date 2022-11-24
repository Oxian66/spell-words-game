import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  startGame() {
    return this.appService.startGame();
  }
  @Get('/match/:word')
  matchWord(@Param('word') word: string) {
    //Logger.log(' something wrong');
    return this.appService.matchWord(word);
  }
}
