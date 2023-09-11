import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Favorite extends Document {
  @ApiProperty()
  @Prop({
    required: true,
  })
  @ApiProperty()
  idUser: string;
  @Prop({
    required: true,
  })
  idPost: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
