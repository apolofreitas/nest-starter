import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { IFile } from '@/shared/decorators/upload-file.decorator'
import { removeFile } from '@/shared/helpers/file.helpers'
import {
  hashPassword,
  compareHashPassword,
} from '@/shared/helpers/password.helpers'
import { User } from './models/user.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(body: User): Promise<User> {
    if (
      (await this.findByUsernameOrEmail(body.email)) ||
      (await this.findByUsernameOrEmail(body.username))
    )
      return undefined

    const user = await new this.userModel({
      ...body,
      password: await hashPassword(body.password),
    }).save()

    return user
  }

  async findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userModel
      .findOne({ $or: [{ email: username }, { username }] })
      .exec()
    if (user && (await compareHashPassword(password, user.password)))
      return user
    return undefined
  }

  async update(id: string, model: User): Promise<User> {
    const newModel = { ...model }
    delete newModel.email
    delete newModel.username
    delete newModel.id

    return await this.userModel.findByIdAndUpdate(id, newModel, { new: true })
  }

  async updatePhoto(id: string, file: IFile): Promise<User> {
    const user = await this.findByIdOrEmail(id)
    if (user === undefined) return undefined
    const model = user as User
    await removeFile(`${model?.photo?.destination}/${model?.photo?.filename}`)
    model.photo = file
    return await this.userModel.findByIdAndUpdate(id, model, { new: true })
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findByIdOrEmail(id: string): Promise<User> {
    let _id = Types.ObjectId.createFromTime(0)
    if (Types.ObjectId.isValid(id)) _id = Types.ObjectId(id)

    const user = await this.userModel
      .findOne({ $or: [{ email: id }, { _id }] })
      .exec()
    if (user) return user

    return undefined
  }

  private async findByUsernameOrEmail(target: string): Promise<User> {
    const user = await this.userModel
      .findOne({ $or: [{ email: target }, { username: target }] })
      .exec()
    if (user) return user
    return undefined
  }
  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec()
    if (user) return user
    return undefined
  }

  async findByUsernameOrDisplayName(name: string): Promise<User[]> {
    const user = await this.userModel
      .find({
        $or: [
          { username: new RegExp(`^${name}`, 'i') },
          { displayName: new RegExp(`^${name}`, 'i') },
        ],
      })
      .select('-email')
      .exec()
    if (user) return user
    return undefined
  }
}
