import { unlinkSync } from 'fs'

export function removeFile(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      unlinkSync(path)
      resolve(true)
    } catch (error) {
      console.error(`Error to unlink file ${path}`, error)
      resolve(false)
    }
  })
}
