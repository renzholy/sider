import TrieMap from 'mnemonist/trie-map'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAsyncEffect from 'use-async-effect'
import { Button, ProgressBar } from '@blueprintjs/core'
import { map, sortBy, sumBy } from 'lodash'
import bytes from 'bytes'
import { useHistory } from 'umi'

import { runCommand } from '@/utils/fetcher'
import { scan2 } from '@/utils/scanner'
import { KeyType } from '@/types'
import { InfiniteListItem } from '@/components/pure/InfiniteListItem'
import { KeyTag } from '@/components/KeyTag'
import { actions } from '@/stores'
import { Footer } from '@/components/pure/Footer'
import { formatNumber } from '@/utils/formatter'

type Data = {
  type: KeyType
  key: string
  memory: number
}

const spliter = ':'

function mapper(keyType: KeyType, trie: TrieMap<string, number>) {
  return (item: [string, number]) => ({
    type: keyType,
    key: item[0],
    memory: sumBy(trie.find(item[0]), (t) => t[1]),
  })
}

export default () => {
  const connection = useSelector((state) => state.root.connection)
  const [dbsize, setDbsize] = useState(0)
  const [totalScanned, setTotalScanned] = useState(0)
  const [ranks, setRanks] = useState<{ [key in KeyType]?: Data[] }>({})
  const [stopped, setStopped] = useState(false)
  const [next, setNext] = useState('')
  useAsyncEffect(
    async (isMounted) => {
      if (!connection || stopped) {
        return
      }
      setDbsize(
        await runCommand<number>(connection, ['dbsize']),
      )
      let _next = '0'
      let _totalScanned = 0
      const tries = {
        [KeyType.STRING]: new TrieMap<string, number>(),
        [KeyType.LIST]: new TrieMap<string, number>(),
        [KeyType.SET]: new TrieMap<string, number>(),
        [KeyType.HASH]: new TrieMap<string, number>(),
        [KeyType.ZSET]: new TrieMap<string, number>(),
        [KeyType.NONE]: new TrieMap<string, number>(),
      }
      setNext('')
      setRanks({})
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const scanned = await scan2(connection, _next, _totalScanned)
        _next = scanned.next
        setNext(_next)
        _totalScanned = scanned.totalScanned
        setTotalScanned(_totalScanned)
        // eslint-disable-next-line no-restricted-syntax
        for (const item of scanned.keys) {
          const prefix = item.key.split(spliter).slice(0, -1).join(spliter)
          if (prefix) {
            tries[item.type].update(
              prefix,
              (memory) => (memory || 0) + item.memory,
            )
          }
        }
        setRanks({
          [KeyType.STRING]: sortBy(
            Array.from(tries[KeyType.STRING].entries()).map(
              mapper(KeyType.STRING, tries[KeyType.STRING]),
            ),
            'memory',
          ).reverse(),
          [KeyType.LIST]: sortBy(
            Array.from(tries[KeyType.LIST].entries()).map(
              mapper(KeyType.LIST, tries[KeyType.LIST]),
            ),
            'memory',
          ).reverse(),
          [KeyType.SET]: sortBy(
            Array.from(tries[KeyType.SET].entries()).map(
              mapper(KeyType.SET, tries[KeyType.SET]),
            ),
            'memory',
          ).reverse(),
          [KeyType.HASH]: sortBy(
            Array.from(tries[KeyType.HASH].entries()).map(
              mapper(KeyType.HASH, tries[KeyType.HASH]),
            ),
            'memory',
          ).reverse(),
          [KeyType.ZSET]: sortBy(
            Array.from(tries[KeyType.ZSET].entries()).map(
              mapper(KeyType.ZSET, tries[KeyType.ZSET]),
            ),
            'memory',
          ).reverse(),
        })
        if (scanned.next === '0' || !isMounted()) {
          break
        }
      }
    },
    [connection, stopped],
  )
  const progress = useMemo(() => (dbsize ? totalScanned / dbsize : 0), [
    dbsize,
    totalScanned,
  ])
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    if (next === '0') {
      setStopped(true)
    }
  }, [next])
  useEffect(() => {
    if (connection) {
      setStopped(false)
    }
  }, [connection])

  return (
    <div
      style={{ margin: 8, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'scroll' }}>
        {map(ranks, (rank, type) => (
          <div key={type} style={{ breakInside: 'avoid' }}>
            {rank?.map((item) => (
              <InfiniteListItem
                key={item.key}
                onSelect={() => {
                  dispatch(actions.keys.setMatch(item.key))
                  dispatch(
                    actions.keys.setSelectedKey({
                      type: item.type,
                      key: item.key,
                    }),
                  )
                  history.push('/keys')
                }}>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <span>
                    <KeyTag type={item.type} />
                    &nbsp;
                    {item.key}
                    {spliter}*
                  </span>
                  {bytes(item.memory)}
                </span>
              </InfiniteListItem>
            ))}
          </div>
        ))}
      </div>
      {progress < 1 ? (
        <div style={{ marginTop: 8 }}>
          <ProgressBar animate={!stopped} value={progress} />
        </div>
      ) : null}
      <Footer>
        <span style={{ flexBasis: 30 }} />
        <span>
          {formatNumber(Math.min(totalScanned, dbsize))}&nbsp;of&nbsp;
          {formatNumber(dbsize)}
        </span>
        <Button
          icon={stopped ? 'refresh' : 'stop'}
          minimal={true}
          style={{ marginLeft: 8 }}
          onClick={() => {
            setStopped(!stopped)
          }}
        />
      </Footer>
    </div>
  )
}
