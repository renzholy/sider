/**
 * @see https://pkg.go.dev/github.com/go-redis/redis/v8?tab=doc#UniversalOptions
 */
export type Connection = {
  name?: string
  addrs: string[]
  db: number
  username?: string
  password?: string
  masterName?: string
}

export enum KeyType {
  NONE = 'none',
  STRING = 'string',
  LIST = 'list',
  SET = 'set',
  ZSET = 'zset',
  HASH = 'hash',
  STREAM = 'stream',
}
