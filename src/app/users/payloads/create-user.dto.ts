import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { BaseUserDto } from './base-user.dto'

export class CreateUserDto extends BaseUserDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string
}
