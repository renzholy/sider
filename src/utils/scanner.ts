import { chunk, isEqual } from 'lodash'

import { Connection, KeyType } from '@/types'
import { runCommand, runPipeline } from './fetcher'

function calcCount(zeroTimes: number): number {
  return Math.max(16, Math.min(8192, 4 ** zeroTimes))
}

export async function scan(
  connection: Connection,
  match: string,
  isPrefix: boolean,
  keyType: KeyType | undefined,
  cursor: string,
  zeroTimes: number,
  totalScanned: number,
  getKey?: { key: string; type: KeyType },
): Promise<{
  next: string
  keys: { key: string; type: KeyType }[]
  zeroTimes: number
  totalScanned: number
  getKey?: { key: string; type: KeyType }
}> {
  if (!getKey && match) {
    const type = await runCommand<KeyType>(connection, ['type', match])
    if (type !== KeyType.NONE) {
      return {
        next: '',
        keys: [{ key: match, type }],
        zeroTimes: 0,
        totalScanned: 1,
        getKey: { key: match, type },
      }
    }
  }
  const count = calcCount(zeroTimes)
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'scan',
    cursor,
    'match',
    isPrefix ? `${match}*` : match || '*',
    'count',
    count.toString(),
  ])
  const types = await runPipeline<KeyType[]>(
    connection,
    keys.map((key) => ['type', key]),
  )
  return {
    next,
    keys: keys
      .map((key, index) => ({
        key,
        type: types[index],
      }))
      .filter((item) => !isEqual(item, getKey))
      .filter(({ type }) => !keyType || type === keyType),
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    totalScanned: totalScanned + count,
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
  totalScanned: number,
  getKey?: string,
): Promise<{
  next: string
  keys: string[]
  zeroTimes: number
  totalScanned: number
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
        totalScanned: 1,
        getKey: match,
      }
    }
  }
  const count = calcCount(zeroTimes)
  const [next, keys] = await runCommand<[string, string[]]>(
    connection,
    [
      'sscan',
      key,
      cursor,
      'match',
      isPrefix ? `${match}*` : match || '*',
      'count',
      count.toString(),
    ],
    true,
  )
  return {
    next,
    keys: keys.filter((item) => !isEqual(item, getKey)),
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    totalScanned: totalScanned + count,
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
  totalScanned: number,
  getKey?: { hash: string; value: string },
): Promise<{
  next: string
  keys: { hash: string; value: string }[]
  zeroTimes: number
  totalScanned: number
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
          totalScanned: 1,
          getKey: { hash: match, value },
        }
      }
    } catch {
      // do nothing
    }
  }
  const count = calcCount(zeroTimes)
  const [next, keys] = await runCommand<[string, string[]]>(
    connection,
    [
      'hscan',
      key,
      cursor,
      'match',
      isPrefix ? `${match}*` : match || '*',
      'count',
      count.toString(),
    ],
    true,
  )
  return {
    next,
    keys: chunk(keys, 2)
      .map(([hash, value]) => ({ hash, value }))
      .filter((item) => !isEqual(item, getKey)),
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    totalScanned: totalScanned + count,
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
  totalScanned: number,
  getKey?: { key: string; score: number },
): Promise<{
  next: string
  keys: { key: string; score: number }[]
  zeroTimes: number
  totalScanned: number
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
          totalScanned: 1,
          getKey: { key: match, score: parseInt(score, 10) },
        }
      }
    } catch {
      // do nothing
    }
  }
  const count = calcCount(zeroTimes)
  const [next, keys] = await runCommand<[string, string[]]>(
    connection,
    [
      'zscan',
      key,
      cursor,
      'match',
      isPrefix ? `${match}*` : match || '*',
      'count',
      count.toString(),
    ],
    true,
  )
  return {
    next,
    keys: chunk(keys, 2)
      .map(([k, score]) => ({
        key: k,
        score: parseInt(score, 10),
      }))
      .filter((item) => !isEqual(item, getKey)),
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    totalScanned: totalScanned + count,
    getKey,
  }
}

export async function lrange(
  connection: Connection,
  key: string,
  cursor: string,
  zeroTimes: number,
  totalScanned: number,
): Promise<{
  next: string
  keys: string[]
  zeroTimes: number
  totalScanned: number
}> {
  const count = calcCount(zeroTimes)
  const keys = await runCommand<string[]>(
    connection,
    ['lrange', key, cursor, (parseInt(cursor, 10) + count).toString()],
    true,
  )
  return {
    next: keys.length ? (parseInt(cursor, 10) + keys.length).toString() : '0',
    keys,
    zeroTimes: keys.length === 0 ? zeroTimes + 1 : 0,
    totalScanned: totalScanned + count,
  }
}

export async function scan2(
  connection: Connection,
  cursor: string,
  totalScanned: number,
): Promise<{
  next: string
  keys: { key: string; type: KeyType; memory: number }[]
  totalScanned: number
}> {
  const count = 8192
  const [next, keys] = await runCommand<[string, string[]]>(connection, [
    'scan',
    cursor,
    'count',
    count.toString(),
  ])
  const types = await runPipeline<KeyType[]>(
    connection,
    keys.map((key) => ['type', key]),
  )
  const memories = await runPipeline<number[]>(
    connection,
    keys.map((key) => ['memory', 'usage', key]),
  )
  return {
    next,
    keys: keys.map((key, index) => ({
      key,
      type: types[index],
      memory: memories[index],
    })),
    totalScanned: totalScanned + count,
  }
}
