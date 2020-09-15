import { scan2 } from '@/utils/scanner'
import React from 'react'
import { useSelector } from 'react-redux'
import useAsyncEffect from 'use-async-effect'

export default () => {
  const connection = useSelector((state) => state.root.connection)
  useAsyncEffect(async () => {
    if (!connection) {
      return
    }
    let next = '0'
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const scanned = await scan2(connection, next)
      next = scanned.next
      console.log(scanned)
      if (scanned.next === '0') {
        break
      }
    }
  }, [connection])

  return <>123</>
}
