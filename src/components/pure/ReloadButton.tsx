import React from 'react'
import { Spinner, Tooltip, Button } from '@blueprintjs/core'

export function ReloadButton(props: { isLoading: boolean; onReload(): void }) {
  return props.isLoading ? (
    <div style={{ width: 30, cursor: 'not-allowed' }}>
      <Spinner size={16} />
    </div>
  ) : (
    <Tooltip content="Refresh">
      <Button icon="refresh" minimal={true} onClick={props.onReload} />
    </Tooltip>
  )
}
