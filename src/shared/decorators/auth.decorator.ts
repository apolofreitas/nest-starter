import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface IAuthUser {
  userId: string
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
