import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ versionKey: false })
export class File extends Document {
  @Prop({ required: true })
  readonly originalname: string
  @Prop({ required: true })
  readonly mimetype: string
  @Prop({ required: true })
  readonly destination: string
  @Prop({ required: true })
  readonly filename: string
  @Prop({ required: true })
  readonly path: string
  @Prop({ required: true })
  readonly size: string
}

export const FileSchema = SchemaFactory.createForClass<File>(File)
  .set('toObject', {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id
    },
  })
  .set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id
    },
  })
