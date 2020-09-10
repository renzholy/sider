import React from 'react'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import { Colors } from '@blueprintjs/core'

import { runCommand } from '@/utils/fetcher'
import { useIsDarkMode } from '@/hooks/use-is-dark-mode'

export default () => {
  const connection = useSelector((state) => state.root.connection)
  const { data } = useSWR(`info/${JSON.stringify(connection)}`, () =>
    runCommand<string>(connection!, ['info']),
  )
  const isDarkMode = useIsDarkMode()

  return (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflow: 'scroll',
        borderRadius: 4,
        padding: 8,
        margin: 8,
        width: '100%',
        backgroundColor: isDarkMode ? Colors.DARK_GRAY1 : Colors.WHITE,
      }}>
      {data}
    </div>
  )
}
