import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    startGame(): void;
    matchWord(word: string): Promise<boolean>;
}
