import React, { useMemo } from 'react'
import useSWR from 'swr'
import { useSelector } from 'react-redux'
import { Colors, H4 } from '@blueprintjs/core'

import { runCommand } from '@/utils/fetcher'
import { useIsDarkMode } from '@/hooks/use-is-dark-mode'
import styles from './info.less'

export default () => {
  const connection = useSelector((state) => state.root.connection)
  const { data } = useSWR(`info/${JSON.stringify(connection)}`, () =>
    runCommand<string>(connection!, ['info']),
  )
  const isDarkMode = useIsDarkMode()
  const info = useMemo(
    () =>
      data
        ?.trimRight()
        .split('\n\r\n')
        .map((section) =>
          section.split('\n').map((line, index) => {
            return index === 0 ? line.substr(2) : line.split(':')
          }),
        ),
    [data],
  )

  return (
    <div
      style={{
        width: '100%',
        overflow: 'scroll',
        margin: '0 8px',
      }}>
      {info?.map((section) =>
        section.length === 1 ? null : (
          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              borderRadius: 4,
              padding: 8,
              margin: '8px 0',
              backgroundColor: isDarkMode ? Colors.DARK_GRAY1 : Colors.WHITE,
            }}>
            <H4>{section[0]}</H4>
            {section.map((line) =>
              typeof line === 'string' ? null : (
                <p key={line[0]} className={styles.item}>
                  {line[0]}:&nbsp;
                  <span style={{ float: 'right' }}>{line[1]}</span>
                </p>
              ),
            )}
          </div>
        ),
      )}
    </div>
  )
}
