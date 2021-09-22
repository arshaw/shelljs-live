
export function parseCommand(command: string | string[]): [string, string[], boolean] {
  return Array.isArray(command)
    ? [command[0], command.splice(1), false] // shell=false
    : [command, [], true] // shell=true
}

export function buildErrorMessage(command0: string, status: number | null): string {
  return `Command '${command0}' failed with status code ${status}`
}
