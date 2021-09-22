import { live as origLive, Options } from './'
import { parseCommand, buildErrorMessage } from './utils'

export function live(command: string | string[], options?: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    origLive(command, options, (status) => {
      if (status === 0) {
        resolve()
      } else {
        const errorMessage = buildErrorMessage(parseCommand(command)[0], status)
        reject(new Error(errorMessage))
      }
    })
  })
}

export { Options } from './'
