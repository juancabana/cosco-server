import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @ApiProperty()
  @Prop({
    unique: true,
    required: true,
  })
  username: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  fullName: string;

  @ApiProperty()
  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  password: string;

  @ApiProperty()
  @Prop({
    unique: true,
    required: true,
  })
  phoneNumber: string;

  @ApiProperty()
  @Prop()
  image: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  description: string;

  @ApiProperty()
  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty()
  @Prop({
    required: true,
    default: ['user'],
  })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
