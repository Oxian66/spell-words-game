import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type WordDocument = Word & Document;

@Schema()
export class Word {
  @Prop()
  word: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
