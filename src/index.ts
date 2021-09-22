import { SpawnOptions } from 'child_process'
import * as spawn from 'cross-spawn'
import { config } from 'shelljs'
import { parseCommand, buildErrorMessage } from './utils'

export type Options = SpawnOptions & { async?: boolean, fatal?: boolean, silent?: boolean }
export type Callback = (status: number | null) => void

export function live(command: string | string[], options?: Options): number | null
export function live(command: string | string[], callback: Callback): number | null
export function live(
  command: string | string[],
  options: Options | undefined,
  callback: Callback,
): number | null
export function live(
  command: string | string[],
  optionsOrCallback?: Options | Callback,
  callback?: Callback,
): number | null {
  let options: Options

  if (typeof optionsOrCallback === 'function') {
    callback = optionsOrCallback
    options = {}
  } else {
    options = optionsOrCallback || {}
  }

  const [command0, args, shell] = parseCommand(command)
  if (!command0) {
    throw new Error('Must specify a command')
  }

  const fatal = options.fatal ?? config.fatal
  const silent = options.silent ?? config.silent
  const spawnOptions: SpawnOptions = {
    ...options,
    ...(silent ? {} : { stdio: 'inherit' }),
    shell,
  }

  function handleStatus(status: number | null) {
    if (status === null || status !== 0) {
      if (fatal) {
        console.error(buildErrorMessage(command0, status))
        process.exit(status || 1)
      }
    }
    if (callback) {
      callback(status)
    }
  }

  if (options.async || callback) {
    const childProcess = spawn(command0, args, spawnOptions)
    childProcess.on('close', handleStatus)
    return null
  } else {
    const { status } = spawn.sync(command0, args, spawnOptions)
    handleStatus(status)
    return status
  }
}
