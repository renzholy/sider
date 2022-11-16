import { useMemo } from 'react'
import useSWR from 'swr'
import { useAppSelector } from 'hooks/use-app'
import { Colors, H4 } from '@blueprintjs/core'
import { sortBy } from 'lodash-es'
import { css } from '@emotion/css'
import { runCommand } from 'utils/fetcher'
import useIsDarkMode from 'hooks/use-is-dark-mode'

export default function Info() {
  const connection = useAppSelector((state) => state.root.connection)
  const { data } = useSWR(['info', connection], () =>
    runCommand<string>(connection!, ['info']),
  )
  const isDarkMode = useIsDarkMode()
  const info = useMemo(
    () =>
      sortBy(
        data
          ?.trimRight()
          .split('\n\r\n')
          .map((section) =>
            section
              .split('\n')
              .map((line, index) =>
                index === 0 ? line.substr(2) : line.split(':'),
              ),
          ),
        (section) => section.length,
      ),
    [data],
  )

  return (
    <div
      style={{
        width: '100%',
        overflow: 'scroll',
        margin: 8,
        borderRadius: 4,
      }}
    >
      <div
        style={{
          columnCount: 2,
          columnGap: 8,
        }}
      >
        {info.map((section) =>
          section.length === 1 ? null : (
            <div
              key={section[0] as string}
              style={{
                breakInside: 'avoid',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                borderRadius: 4,
                padding: 8,
                marginBottom: 8,
                backgroundColor: isDarkMode ? Colors.DARK_GRAY1 : Colors.WHITE,
              }}
            >
              <H4>{section[0]}</H4>
              {section.map((line) =>
                typeof line === 'string' ? null : (
                  <p
                    key={line[0]}
                    className={css`
                      border-radius: 4px;
                      margin: 0;
                      padding: 4px;
                      @media (prefers-color-scheme: light) {
                        &:hover {
                          background-color: var(--light-gray4);
                        }
                      }
                      @media (prefers-color-scheme: dark) {
                        &:hover {
                          background-color: var(--dark-gray4);
                        }
                      }
                    `}
                  >
                    {line[0]}
                    <span style={{ float: 'right' }}>{line[1]}</span>
                  </p>
                ),
              )}
            </div>
          ),
        )}
      </div>
    </div>
  )
}
