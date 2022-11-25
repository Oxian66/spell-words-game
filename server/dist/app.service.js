"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const crypto_1 = require("crypto");
let AppService = class AppService {
    constructor() {
        this.alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        this.letters = [];
        this.score = 0;
        this.startGame();
    }
    generateLetter(source) {
        return {
            id: (0, crypto_1.randomUUID)(),
            value: source[Math.trunc(Math.random() * source.length)],
        };
    }
    startGame() {
        const buffer = [];
        for (let i = 0; i < 64; i++)
            buffer.push(this.generateLetter(this.alphabet));
        this.letters = [...buffer];
    }
    getLetters() {
        return this.letters;
    }
    async processInput(input) {
        const word = input.map((el) => el.value).join('');
        const isCorrect = await this.matchWord(word);
        if (isCorrect) {
            if (input.length <= 3)
                this.score += 1;
            else if (input.length > 3 && input.length <= 6)
                this.score += 2;
            else
                this.score += 3;
            const newLetters = this.letters.map((letter) => {
                if (input.filter((el) => el.id === letter.id).length)
                    return this.generateLetter(this.alphabet);
                return letter;
            });
            this.letters = newLetters;
            const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
            let vowCount = 0;
            for (const letter of newLetters)
                if (vowels.includes(letter.value))
                    vowCount += 1;
            if (vowCount < 3)
                this.startGame();
        }
        return {
            isCorrect,
            letters: this.letters,
            score: this.score,
        };
    }
    async matchWord(word) {
        try {
            const res = await axios_1.default
                .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                .then((r) => {
                return r.data[0].meanings.filter((meaning) => meaning.partOfSpeech === 'noun').length > 0;
            })
                .catch(() => false);
            return res;
        }
        catch (err) {
            console.log(err);
            throw new Error('pizdec polniy');
        }
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map