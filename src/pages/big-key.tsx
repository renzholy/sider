import FixedReverseHeap from 'mnemonist/fixed-reverse-heap'
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAsyncEffect from 'use-async-effect'
import { Button, ProgressBar } from '@blueprintjs/core'
import { map } from 'lodash'
import bytes from 'bytes'
import { useHistory } from 'umi'

import { runCommand } from '@/utils/fetcher'
import { scan2 } from '@/utils/scanner'
import { KeyType } from '@/types'
import { InfiniteListItem } from '@/components/pure/InfiniteListItem'
import { KeyTag } from '@/components/KeyTag'
import { actions } from '@/stores'

type Data = {
  type: KeyType
  key: string
  memory: number
}

export default () => {
  const connection = useSelector((state) => state.root.connection)
  const [dbsize, setDbsize] = useState(0)
  const [totalScanned, setTotalScanned] = useState(0)
  const [ranks, setRanks] = useState<{ [key in KeyType]?: Data[] }>({})
  const [stopped, setStopped] = useState(false)
  useAsyncEffect(
    async (isMounted) => {
      if (!connection || stopped) {
        return
      }
      setDbsize(
        await runCommand<number>(connection, ['dbsize']),
      )
      let next = '0'
      let _totalScanned = 0
      const comparator = (a: Data, b: Data) => b.memory - a.memory
      const heaps = {
        [KeyType.STRING]: new FixedReverseHeap<Data>(Array, comparator, 10),
        [KeyType.LIST]: new FixedReverseHeap<Data>(Array, comparator, 10),
        [KeyType.SET]: new FixedReverseHeap<Data>(Array, comparator, 10),
        [KeyType.HASH]: new FixedReverseHeap<Data>(Array, comparator, 10),
        [KeyType.ZSET]: new FixedReverseHeap<Data>(Array, comparator, 10),
        [KeyType.NONE]: new FixedReverseHeap<Data>(Array, comparator, 10),
      }
      setRanks({})
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const scanned = await scan2(connection, next, _totalScanned)
        next = scanned.next
        _totalScanned = scanned.totalScanned
        setTotalScanned(_totalScanned)
        // eslint-disable-next-line no-restricted-syntax
        for (const item of scanned.keys) {
          heaps[item.type].push(item)
        }
        setRanks({
          [KeyType.STRING]: Array.from(heaps[KeyType.STRING].toArray()),
          [KeyType.LIST]: Array.from(heaps[KeyType.LIST].toArray()),
          [KeyType.SET]: Array.from(heaps[KeyType.SET].toArray()),
          [KeyType.HASH]: Array.from(heaps[KeyType.HASH].toArray()),
          [KeyType.ZSET]: Array.from(heaps[KeyType.ZSET].toArray()),
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

  return (
    <div
      style={{ margin: 8, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <ProgressBar animate={!stopped} value={progress} />
        <Button
          icon={stopped ? 'refresh' : 'stop'}
          minimal={true}
          style={{ marginLeft: 8 }}
          onClick={() => {
            setStopped(!stopped)
          }}
        />
      </div>
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
                  </span>
                  {bytes(item.memory)}
                </span>
              </InfiniteListItem>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
