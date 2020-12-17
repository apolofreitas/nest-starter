import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { existsSync } from 'fs'
import { JwtAuthGuard } from '@/app/auth/jwt-auth.guard'
import { getHttpUrl, transformJsonField } from '@/shared/helpers/url.helper'
import {
  UploadFileConfig,
  IFile,
} from '@/shared/decorators/upload-file.decorator'
import { AuthUser, IAuthUser } from '@/shared/decorators/auth.decorator'
import { UsersService } from './users.service'
import { User } from './models/user.model'
import { UpdateUserDto } from './payloads/update-user.dto'
import { CreateUserDto } from './payloads/create-user.dto'

const PROFILE_PHOTO_URL = 'api/v1/users/profile-photo/'

@ApiTags('users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request): Promise<User[]> {
    const result = await this.usersService.findAll()

    return result.map((user) => {
      return transformJsonField(
        user.toJSON(),
        'photo',
        `${getHttpUrl(req)}${PROFILE_PHOTO_URL}${user.id}`,
      ) as User
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findByIdOrEmail(
    @Param('userId') id: string,
    @Req() req: Request,
  ): Promise<User> {
    const user = await this.usersService.findByIdOrEmail(id)
    if (!user) throw new HttpException(undefined, HttpStatus.NOT_FOUND)

    return transformJsonField(
      user.toJSON(),
      'photo',
      `${getHttpUrl(req)}${PROFILE_PHOTO_URL}${user.id}`,
    ) as User
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(body as User)
    if (!user)
      throw new HttpException(
        'Email or username already in use',
        HttpStatus.CONFLICT,
      )

    return user
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async update(
    @Param('userId') id: string,
    @Body() model: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.findByIdOrEmail(id)
    if (!user) {
      throw new HttpException(undefined, HttpStatus.NOT_FOUND)
    }
    return await this.usersService.update(id, model as User)
  }

  @UseGuards(JwtAuthGuard)
  @UploadFileConfig('file', 'profile')
  @Post('upload/profile-photo')
  async uploadFile(
    @AuthUser() user: IAuthUser,
    @Req() req: Request,
    @UploadedFile() file: IFile,
  ): Promise<User> {
    const result = await this.usersService.updatePhoto(user.userId, file)
    if (!result) throw new HttpException(undefined, HttpStatus.NOT_FOUND)

    return transformJsonField(
      result.toJSON(),
      'photo',
      `${getHttpUrl(req)}${PROFILE_PHOTO_URL}${result.id}`,
    ) as User
  }

  @Get('profile-photo/:userId')
  async findPhotoByUser(
    @Param('userId') id: string,
    @Res() response: Response,
  ): Promise<any> {
    const result = (await this.usersService.findByIdOrEmail(id)).photo
    if (!result || !existsSync(`${result.destination}/${result.filename}`))
      throw new HttpException(undefined, HttpStatus.NOT_FOUND)

    const options = {
      root: result.destination,
      headers: {
        'Content-Type': result.mimetype,
        'Content-Length': result.size,
        'Content-Disposition': `inline;filename="${result.filename}"`,
      },
    }

    return response.sendFile(result.filename, options)
  }
}
