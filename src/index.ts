import { SpawnOptions } from 'child_process'
import * as spawn from 'cross-spawn'
import { config } from 'shelljs'

export type Callback = (status: number | null) => void
export type Options = SpawnOptions & { async?: boolean, fatal?: boolean, silent?: boolean }

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

  let command0: string
  let args: string[]
  let shell: boolean

  if (Array.isArray(command)) {
    command0 = command[0]
    args = command.slice(1)
    shell = false
  } else {
    command0 = command
    args = []
    shell = true
  }

  if (!command0) {
    throw new Error('Must specify a command')
  }

  const fatal = options.fatal ?? config.fatal
  const silent = options.silent ?? config.silent
  const spawnOptions: SpawnOptions = {
    ...(silent ? {} : { stdio: 'inherit' }),
    ...options,
    shell,
  }

  function handleStatus(status: number | null) {
    if (status === null || status !== 0) {
      if (fatal) {
        console.error(`Command '${command0}' failed with status code ${status}`)
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
