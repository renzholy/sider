import { Connection } from '@/types'

export async function runCommand<T>(
  connection: Connection,
  command: string[],
): Promise<T> {
  const response = await fetch(
    `/api/runCommand?c=${encodeURIComponent(command.join('_'))}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connection,
        command,
      }),
    },
  )
  if (response.ok) {
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
