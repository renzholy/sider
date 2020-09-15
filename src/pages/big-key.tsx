import { runCommand } from '@/utils/fetcher'
import { scan2 } from '@/utils/scanner'
import { ProgressBar } from '@blueprintjs/core'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useAsyncEffect from 'use-async-effect'

export default () => {
  const connection = useSelector((state) => state.root.connection)
  const [dbsize, setDbsize] = useState(0)
  const [totalScanned, setTotalScanned] = useState(0)
  useAsyncEffect(
    async (isMounted) => {
      if (!connection) {
        return
      }
      setDbsize(
        await runCommand<number>(connection, ['dbsize']),
      )
      let next = '0'
      let _totalScanned = 0
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const scanned = await scan2(connection, next, _totalScanned)
        next = scanned.next
        _totalScanned = scanned.totalScanned
        setTotalScanned(_totalScanned)
        if (scanned.next === '0' || !isMounted()) {
          break
        }
      }
    },
    [connection],
  )
  const progress = useMemo(() => (dbsize ? totalScanned / dbsize : 0), [
    dbsize,
    totalScanned,
  ])

  return (
    <div style={{ margin: 8, flex: 1 }}>
      <ProgressBar value={progress} />
    </div>
  )
}
