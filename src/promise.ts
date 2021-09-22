import { live as origLive, Options } from './'

export function live(command: string | string[], options?: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    origLive(command, options, (status) => {
      if (status === 0) {
        resolve()
      } else {
        const command0 = Array.isArray(command) ? command[0] : command
        reject(new Error(`Command '${command0}' failed with status code ${status}`))
      }
    })
  })
}

export { Options } from './'
