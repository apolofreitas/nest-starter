import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'

export interface Response<T> {
  data: T
}

@Injectable()
export class TransformFieldInUrlInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  field: string
  url: string
  jsonField: string
  constructor(field: string, url: string, jsonField: string) {
    this.field = field
    this.url = url
    this.jsonField = jsonField
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse()
    return next.handle().pipe(
      tap((item) => {
        console.log(`After... ${item}`)
      }),
    )

    // return next.handle()
    // return next.handle().pipe(map(data => ({ data })));
  }
}
