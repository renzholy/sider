import { chunk, isEqual } from 'lodash'

import { Connection, KeyType } from '@/types'
import { runCommand, runPipeline } from './fetcher'

function calcCount(zeroTimes: number): string {
  return Math.max(16, Math.min(8192, 4 ** zeroTimes)).toString()
}

export async function scan(
  connection: Connection,
  match: string,
  isPrefix: boolean,
  keyType: KeyType | undefined,
  cursor: string,
  zeroTimes: number,
  getKey?: { key: string; type: KeyType },
): Promise<{
  next: string
  keys: { key: string; type: KeyType }[]
  zeroTimes: number
  getKey?: { key: string; type: KeyType }
}> {
  if (!getKey && match) {
    const type = await runCommand<KeyType>(connection, ['type', match])
    if (type !== KeyType.NONE) {
      return {
        next: '',
        keys: [{ key: match, type }],
        zeroTimes: 0,
        getKey: { key: match, type },
      }
    }
  }
  const [next, ks] = await runCommand<[string, string[]]>(connection, [
    'scan',
    cursor,
    'match',
    isPrefix ? `${match}*` : match || '*',
    'count',
    calcCount(zeroTimes),
  ])
  const types = await runPipeline<KeyType[]>(
    connection,
    ks.map((key) => ['type', key]),
  )
  const keys = ks
    .map((key, index) => ({
      key,
      type: types[index],
    }))
    .filter((item) => !isEqual(item, getKey))
    .filter(({ type }) => !keyType || type === keyType)
  return {
    next,
    keys,
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    getKey,
  }
}

export async function sscan(
  connection: Connection,
  key: string,
  match: string,
  isPrefix: boolean,
  cursor: string,
  zeroTimes: number,
  getKey?: string,
): Promise<{
  next: string
  keys: string[]
  zeroTimes: number
  getKey?: string
}> {
  if (!getKey && match) {
    const isMember = await runCommand<number>(connection, [
      'sismember',
      key,
      match,
    ])
    if (isMember === 1) {
      return {
        next: '',
        keys: [match],
        zeroTimes: 0,
        getKey: match,
      }
    }
  }
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'sscan',
    key,
    cursor,
    'match',
    isPrefix ? `${match}*` : match || '*',
    'count',
    calcCount(zeroTimes),
  ])
  return {
    next,
    keys: keys.filter((item) => !isEqual(item, getKey)),
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    getKey,
  }
}

export async function hscan(
  connection: Connection,
  key: string,
  match: string,
  isPrefix: boolean,
  cursor: string,
  zeroTimes: number,
  getKey?: { hash: string; value: string },
): Promise<{
  next: string
  keys: { hash: string; value: string }[]
  zeroTimes: number
  getKey?: { hash: string; value: string }
}> {
  if (!getKey && match) {
    try {
      const value = await runCommand<KeyType>(connection, ['hget', key, match])
      if (value) {
        return {
          next: '',
          keys: [{ hash: match, value }],
          zeroTimes: 0,
          getKey: { hash: match, value },
        }
      }
    } catch {
      // do nothing
    }
  }
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'hscan',
    key,
    cursor,
    'match',
    isPrefix ? `${match}*` : match || '*',
    'count',
    calcCount(zeroTimes),
  ])
  return {
    next,
    keys: chunk(keys, 2)
      .map(([hash, value]) => ({ hash, value }))
      .filter((item) => !isEqual(item, getKey)),
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    getKey,
  }
}

export async function zscan(
  connection: Connection,
  key: string,
  match: string,
  isPrefix: boolean,
  cursor: string,
  zeroTimes: number,
  getKey?: { key: string; score: number },
): Promise<{
  next: string
  keys: { key: string; score: number }[]
  zeroTimes: number
  getKey?: { key: string; score: number }
}> {
  if (!getKey && match) {
    try {
      const score = await runCommand<string>(connection, ['zscore', key, match])
      if (score) {
        return {
          next: '',
          keys: [{ key: match, score: parseInt(score, 10) }],
          zeroTimes: 0,
          getKey: { key: match, score: parseInt(score, 10) },
        }
      }
    } catch {
      // do nothing
    }
  }
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'zscan',
    key,
    cursor,
    'match',
    isPrefix ? `${match}*` : match || '*',
    'count',
    calcCount(zeroTimes),
  ])
  return {
    next,
    keys: chunk(keys, 2)
      .map(([k, score]) => ({
        key: k,
        score: parseInt(score, 10),
      }))
      .filter((item) => !isEqual(item, getKey)),
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    getKey,
  }
}

export async function lrange(
  connection: Connection,
  key: string,
  cursor: string,
): Promise<{
  next: string
  keys: string[]
}> {
  const keys = await runCommand<string[]>(connection, [
    'lrange',
    key,
    cursor,
    (parseInt(cursor, 10) + 10).toString(),
  ])
  return {
    next: (parseInt(cursor, 10) + keys.length).toString(),
    keys,
  }
}
