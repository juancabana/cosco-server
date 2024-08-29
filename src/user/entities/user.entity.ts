import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

type Role = 'CUSTOMER' | 'OWNER';
@Schema()
export class User extends Document {
  @ApiProperty()
  @Prop({
    required: true,
  })
  firstName: string;

  @ApiProperty()
  @Prop()
  secondName: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  lastName: string;

  @ApiProperty()
  @Prop({
    required: false,
    default: '',
  })
  secondLastName: string;

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
    required: false,
    default: '',
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
    required: false,
    default: ['CUSTOMER'],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
