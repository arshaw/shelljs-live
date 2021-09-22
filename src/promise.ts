import { live as origLive, Options } from './'

export function live(tokens: string[], options?: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    origLive(tokens, options, (status) => {
      if (status === 0) {
        resolve()
      } else {
        reject(new Error(`Command '${tokens[0]}' failed with status code ${status}`))
      }
    })
  })
}

export { Options } from './'
