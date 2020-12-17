import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { BaseUserDto } from './base-user.dto'

export class UpdateUserDto extends BaseUserDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  displayName: string

  @IsOptional()
  email: string

  @IsOptional()
  username: string
}
