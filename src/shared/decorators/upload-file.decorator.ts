import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express'

import { diskStorage, File } from 'multer'
import { nanoid } from 'nanoid'
import { extname, sep } from 'path'

export type IFile = File

const storageConfig = (path: string) => {
  return diskStorage({
    destination: path
      ? `${process.env.UPLOAD_DIR}${sep}${path}`
      : `${process.env.UPLOAD_TEMP_DIR}`,
    filename: function (req, file: IFile, cb) {
      cb(null, `${nanoid(36)}${extname(file.originalname)}`)
    },
  })
}

/**
 *
 * @param field name of input file
 * @param maxFiles max quantity to accept at per request
 * @param path relative path to UPLOAD_DIR env, default is temp folder
 */
export function UploadFilesConfig(
  field: string,
  maxFiles = 1,
  path?: string,
): IFile {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(field, maxFiles, {
        storage: storageConfig(path),
      }),
    ),
  )
}

/**
 *
 * @param field name of input file
 * @param path relative path to UPLOAD_DIR env, default is temp folder
 */
export function UploadFileConfig(field: string, path?: string): IFile {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(field, {
        storage: storageConfig(path),
      }),
    ),
  )
}
