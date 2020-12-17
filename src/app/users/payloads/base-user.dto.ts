import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail } from 'class-validator'

export class BaseUserDto {
  @ApiProperty()
  displayName: string

  @ApiProperty()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string
}
