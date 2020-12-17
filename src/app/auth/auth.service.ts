import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '../users/models/user.model'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findByUsernameAndPassword(
      username,
      pass,
    )
    if (user) {
      return user as User
    }
    return null
  }

  async login(user: { id: string }): Promise<{ access_token: string }> {
    const payload = { sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
