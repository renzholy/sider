/**
 * @see https://pkg.go.dev/github.com/go-redis/redis/v8?tab=doc#UniversalOptions
 */
export type Connection = {
  addrs: string[]
  db: number
  username?: string
  password?: string
  masterName?: string
}

export enum KeyType {
  STRING = 'string',
  LIST = 'list',
  SET = 'set',
  ZSET = 'zset',
  HASH = 'hash',
  STREAM = 'stream',
  NONE = 'none',
}
