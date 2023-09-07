import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Date, Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema()
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  owner: string;

  @Prop({
    unique: true,
    required: true,
  })
  tittle: string;
  @Prop({
    required: true,
  })
  product: string;
  @Prop({
    required: true,
  })
  departament: string;
  @Prop({
    required: true,
  })
  city: string;
  @Prop({
    required: true,
  })
  stock: number;
  @Prop({
    required: true,
  })
  massUnit: string;
  @Prop({
    required: true,
  })
  price: number;
  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
  @Prop({
    required: true,
  })
  category: string;
  @Prop({
    unique: true,
    required: true,
  })
  description: string;
  @Prop({
    required: true,
  })
  image: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
