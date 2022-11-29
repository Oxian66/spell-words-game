import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { Letter } from './interfaces/letter';

@Injectable()
export class AppService {
  alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  letters = [];
  // score = 0;

  constructor() {
    this.startGame();
  }

  generateLetter(source: string[]): Letter {
    return {
      id: randomUUID(),
      value: source[Math.trunc(Math.random() * source.length)],
    };
  }

  startGame() {
    const buffer = [];
    for (let i = 0; i < 64; i++)
      buffer.push(this.generateLetter(this.alphabet));
    this.letters = [...buffer];
    
  }

  getLetters(): string[] {
    return this.letters;
  }

  async processInput(input: Letter[]) {
    const word = input.map((el) => el.value).join('');
    const isCorrect = await this.matchWord(word);
    let score = 0;
    if (isCorrect) {
      if (input.length <= 3) score += 1;
      else if (input.length > 3 && input.length <= 6) score += 2;
      else score += 3;
      const newLetters = this.letters.map((letter) => {
        if (input.filter((el) => el.id === letter.id).length)
          return this.generateLetter(this.alphabet);
        return letter;
      });
      this.letters = newLetters;
      const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
      let vowCount = 0;
      for (const letter of newLetters)
        if (vowels.includes(letter.value)) vowCount += 1;
      if (vowCount < 3) this.startGame();
    }
    return {
      isCorrect,
      letters: this.letters,
      score: score,
    };
  }

  async matchWord(word: string): Promise<boolean> {
    try {
      const res = await axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((r) => {
          return r.data.reduce((p, c) => [...p, ...c.meanings], []).filter(
            (meaning) => meaning.partOfSpeech === 'noun',
          ).length > 0;
        })
        .catch(() => false);
      return res;
    } catch (err) {
      console.log(err);
      throw new Error('pizdec polniy');
    }
  }

}
