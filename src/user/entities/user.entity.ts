import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    unique: true,
    required: true,
  })
  phoneNumber: string;

  @Prop()
  image: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
    default: true,
    select: false,
  })
  isActive: boolean;

  @Prop({
    required: true,
    default: ['user'],
  })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
