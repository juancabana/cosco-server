import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({
    required: true,
  })
  idUser: string;

  @Prop({
    required: true,
  })
  message: string;

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    required: false,
    default: false,
  })
  seen: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
