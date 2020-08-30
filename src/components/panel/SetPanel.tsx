import React, { useCallback } from 'react'
import { useSWRInfinite } from 'swr'
import { useSelector } from 'react-redux'

import { Unpacked } from '@/utils'
import { sscan } from '@/utils/scanner'
import { SetMatchInput } from './SetMatchInput'
import { SetList } from './SetList'

export function SetPanel(props: { value: string }) {
  const connection = useSelector((state) => state.keys.connection)
  const match = useSelector((state) => state.set.match)
  const isPrefix = useSelector((state) => state.set.isPrefix)
  const handleGetKey = useCallback(
    (
      _index: number,
      previousPageData: Unpacked<ReturnType<typeof sscan>> | null,
    ) => {
      if (previousPageData?.next === '0') {
        return null
      }
      return connection
        ? [
            connection,
            props.value,
            isPrefix ? `${match}*` : match || '*',
            previousPageData?.next || '0',
          ]
        : null
    },
    [connection, props.value, match, isPrefix],
  )
  const { data, setSize } = useSWRInfinite(handleGetKey, sscan, {
    revalidateOnFocus: false,
  })
  const handleLoadMoreItems = useCallback(async () => {
    await setSize((_size) => _size + 1)
  }, [setSize])

  return (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <SetMatchInput />
      {data ? (
        <div style={{ flex: 1 }}>
          <SetList items={data} onLoadMoreItems={handleLoadMoreItems} />
        </div>
      ) : null}
    </div>
  )
}
