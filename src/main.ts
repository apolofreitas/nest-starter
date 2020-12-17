import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from '@/app/app.module'
import { LoggingInterceptor } from '@/shared/interceptors/logging.interceptor'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService: ConfigService = app.get('ConfigService')

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix(configService.get<string>('API_PREFIX'))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Starter')
    .setVersion('1.0.0')
    .addTag('nest-starter')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('/api', app, swaggerDocument)

  await app.listen(configService.get<string>('API_PORT'))
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
