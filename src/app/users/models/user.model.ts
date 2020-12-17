import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { File, FileSchema } from '@/app/files/models/file.model'

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ type: FileSchema, ref: File.name })
  photo: File & string

  @Prop({ required: true })
  readonly displayName: string

  @Prop({ required: true })
  readonly username: string

  @Prop({ required: true })
  readonly email: string

  @Prop({ required: true })
  readonly password: string

  @Prop({ default: Date.now })
  readonly createdAt: Date
}

export const UserSchema = SchemaFactory.createForClass<User>(User)
  .set('toObject', {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id
      delete ret.password
    },
  })
  .set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id
      delete ret.password
    },
  })
