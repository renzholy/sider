import { Connection } from '@/types'

function parseRaw(str: string | string[]): string | string[] {
  if (Array.isArray(str)) {
    return str.map(parseRaw) as string[]
  }
  return Buffer.from(str, 'hex').toString('binary')
}

export async function runCommand<
  T extends string | string[] | [string, string[]]
>(connection: Connection, command: string[], raw: true): Promise<T>
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
    return raw
      ? parseRaw(
          JSON.parse(
            (await response.text())
              .replace(/([0-9A-F]+)/g, '"$1"')
              .replace(/ /g, ','),
          ),
        )
      : response.json()
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
