import { runCommand } from '@/utils/fetcher'
import { scan2 } from '@/utils/scanner'
import { ProgressBar } from '@blueprintjs/core'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useAsyncEffect from 'use-async-effect'

export default () => {
  const connection = useSelector((state) => state.root.connection)
  const [dbsize, setDbsize] = useState(0)
  const totalScanned = useRef(0)
  useAsyncEffect(
    async (isMounted) => {
      if (!connection) {
        return
      }
      setDbsize(
        await runCommand<number>(connection, ['dbsize']),
      )
      let next = '0'
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const scanned = await scan2(connection, next, totalScanned.current)
        next = scanned.next
        totalScanned.current = scanned.totalScanned
        console.log(scanned)
        if (scanned.next === '0' || !isMounted()) {
          break
        }
      }
    },
    [connection],
  )

  return (
    <div style={{ margin: 8, flex: 1 }}>
      <ProgressBar value={dbsize ? totalScanned.current / dbsize : 0} />
    </div>
  )
}
