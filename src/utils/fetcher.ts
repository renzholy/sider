export async function runCommand<T>(
  connection: string,
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

export async function listConnections(): Promise<string[]> {
  const response = await fetch('/api/listConnections', {
    method: 'POST',
  })
  if (response.ok) {
    return response.json()
  }
  throw new Error(await response.text())
}
