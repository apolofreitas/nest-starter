import { genSalt, hash, compare } from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve) => {
    genSalt(10, function (err, salt) {
      hash(password, salt, function (err, hash) {
        resolve(hash)
      })
    })
  })
}

export async function compareHashPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    compare(password, hash).then(function (result) {
      resolve(result)
    })
  })
}
