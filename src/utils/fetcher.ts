import { Connection } from '@/types'

export async function runCommand<T extends string | string[]>(
  connection: Connection,
  command: string[],
  raw: true,
): Promise<T>
export async function runCommand<T>(
  connection: Connection,
  command: string[],
): Promise<T>
export async function runCommand(
  connection: Connection,
  command: string[],
  raw = false,
) {
  const response = await fetch(`/api/runCommand?c=${command.join('_')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connection,
      command,
      raw,
    }),
  })
  if (response.ok) {
    if (raw) {
      const text = await response.text()
      if (text.startsWith('[') && text.endsWith(']')) {
        return text
          .substr(1, text.length - 1)
          .split(' ')
          .map((str) => Buffer.from(str, 'hex').toString('binary'))
      }
      return Buffer.from(text, 'hex').toString('binary')
    }
    return response.json()
  }
  throw new Error(await response.text())
}

export async function runPipeline<T>(
  connection: Connection,
  commands: string[][],
): Promise<T> {
  const response = await fetch('/api/runPipeline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connection,
      commands,
    }),
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error(await response.text())
}

export async function listConnections(): Promise<Connection[]> {
  const response = await fetch('/api/listConnections', {
    method: 'POST',
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error(await response.text())
}
