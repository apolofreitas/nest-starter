import { Controller, Request, Post, UseGuards, HttpCode } from '@nestjs/common'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/v1/auth/login')
  @HttpCode(200)
  async login(
    @Request() req: { user: { id: string } },
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user)
  }
}
