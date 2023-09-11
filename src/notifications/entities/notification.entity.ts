import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @ApiProperty()
  @Prop({
    required: true,
  })
  idUser: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  message: string;

  @ApiProperty()
  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @ApiProperty()
  @Prop({
    required: false,
    default: false,
  })
  seen: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
