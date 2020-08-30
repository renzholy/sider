import { Connection } from '@/types'

export async function runCommand<T>(
  connection: Connection,
  command: string[],
): Promise<T> {
  const response = await fetch('/api/runCommand', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connection,
      command,
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

export async function scanFetcher(
  connection: Connection,
  match: string,
  cursor: string,
): Promise<{
  next: string
  keys: { key: string; type: KeyType }[]
}> {
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'scan',
    cursor,
    'match',
    match,
  ])
  const types = await Promise.all(
    keys.map((key) => runCommand<KeyType>(connection, ['type', key])),
  )
  return {
    next,
    keys: keys.map((key, index) => ({
      key,
      type: types[index],
    })),
  }
}
