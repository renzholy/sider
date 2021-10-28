import { Classes, Colors, Button } from '@blueprintjs/core'
import useIsDarkMode from 'hooks/use-is-dark-mode'
import ConnectionSelector from 'components/connection-selector'
import { useRouter } from 'next/router'
import { Tooltip2 } from '@blueprintjs/popover2'

export default function Layout(props: { children: React.ReactNode }) {
  const isDarkMode = useIsDarkMode()
  const router = useRouter()

  return (
    <div
      className={isDarkMode ? Classes.DARK : undefined}
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <div
        style={{
          width: 50,
          paddingRight: 0,
          backgroundColor: isDarkMode ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY4,
          margin: 8,
          marginRight: 0,
          borderRadius: 4,
          padding: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Tooltip2 content="Keys" placement="right">
            <Button
              icon="list-detail-view"
              minimal={true}
              large={true}
              active={router.pathname === '/keys'}
              onClick={() => {
                router.push('/keys')
              }}
            />
          </Tooltip2>
          <Tooltip2 content="Big key" placement="right">
            <Button
              icon="heatmap"
              minimal={true}
              large={true}
              active={router.pathname === '/big-keys'}
              onClick={() => {
                router.push('/big-keys')
              }}
            />
          </Tooltip2>
          <Tooltip2 content="Info" placement="right">
            <Button
              icon="info-sign"
              minimal={true}
              large={true}
              active={router.pathname === '/info'}
              onClick={() => {
                router.push('/info')
              }}
            />
          </Tooltip2>
        </div>
        <ConnectionSelector />
      </div>
      {props.children}
    </div>
  )
}
