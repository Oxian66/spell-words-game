import { Letter } from './interfaces/letter';
export declare class AppService {
    alphabet: string[];
    letters: any[];
    score: number;
    constructor();
    generateLetter(source: string[]): Letter;
    startGame(): void;
    getLetters(): string[];
    processInput(input: Letter[]): Promise<{
        isCorrect: boolean;
        letters: any[];
        score: number;
    }>;
    matchWord(word: string): Promise<boolean>;
}
