import React, { CSSProperties } from 'react'
import { Spinner, Button } from '@blueprintjs/core'

export function ReloadButton(props: {
  style?: CSSProperties
  isLoading: boolean
  onReload(): void
}) {
  return props.isLoading ? (
    <div
      style={{
        ...props.style,
        width: 30,
        cursor: 'not-allowed',
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: 8,
      }}>
      <Spinner size={16} />
    </div>
  ) : (
    <div style={props.style}>
      <Button
        style={props.style}
        icon="refresh"
        minimal={true}
        onClick={props.onReload}
      />
    </div>
  )
}
