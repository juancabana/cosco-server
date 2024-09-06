import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import mongoose, { Date, Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class Post extends Document {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  owner: string;

  @ApiProperty()
  @Prop({
    unique: true,
    required: true,
  })
  title: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  product: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  department: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  city: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  stock: number;

  @ApiProperty()
  @Prop({
    required: true,
  })
  massUnit: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  price: number;

  @ApiProperty()
  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @ApiProperty()
  @Prop({
    required: true,
  })
  category: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  description: string;

  @ApiProperty()
  @Prop({
    required: true,
  })
  images: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
