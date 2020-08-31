import { chunk } from 'lodash'

import { Connection, KeyType } from '@/types'
import { runCommand } from './fetcher'

export async function scan(
  connection: Connection,
  match: string,
  cursor: string,
  keyType: KeyType | undefined,
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
    keys: keys
      .map((key, index) => ({
        key,
        type: types[index],
      }))
      .filter(({ type }) => !keyType || type === keyType),
  }
}

export async function sscan(
  connection: Connection,
  key: string,
  match: string,
  cursor: string,
): Promise<{
  next: string
  keys: string[]
}> {
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'sscan',
    key,
    cursor,
    'match',
    match,
  ])
  return {
    next,
    keys,
  }
}

export async function hscan(
  connection: Connection,
  key: string,
  match: string,
  cursor: string,
): Promise<{
  next: string
  keys: { hash: string; value: string }[]
}> {
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'hscan',
    key,
    cursor,
    'match',
    match,
  ])
  return {
    next,
    keys: chunk(keys, 2).map(([hash, value]) => ({ hash, value })),
  }
}

export async function zscan(
  connection: Connection,
  key: string,
  match: string,
  cursor: string,
): Promise<{
  next: string
  keys: { key: string; score: number }[]
}> {
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'zscan',
    key,
    cursor,
    'match',
    match,
  ])
  return {
    next,
    keys: chunk(keys, 2).map(([k, score]) => ({
      key: k,
      score: parseInt(score, 10),
    })),
  }
}

export async function lrange(
  connection: Connection,
  key: string,
  startIndex: string,
): Promise<{
  next: string
  keys: string[]
}> {
  const keys = await runCommand<string[]>(connection, [
    'lrange',
    key,
    startIndex,
    (parseInt(startIndex, 10) + 10).toString(),
  ])
  return {
    next: (parseInt(startIndex, 10) + keys.length).toString(),
    keys,
  }
}