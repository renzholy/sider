import React, { CSSProperties } from 'react'
import { Spinner, Tooltip, Button } from '@blueprintjs/core'

export function ReloadButton(props: {
  style?: CSSProperties
  isLoading: boolean
  onReload(): void
}) {
  return props.isLoading ? (
    <div style={{ ...props.style, width: 30, cursor: 'not-allowed' }}>
      <Spinner size={16} />
    </div>
  ) : (
    <div style={props.style}>
      <Tooltip content="Refresh">
        <Button icon="refresh" minimal={true} onClick={props.onReload} />
      </Tooltip>
    </div>
  )
}
