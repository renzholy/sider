import React from 'react'
import { Colors } from '@blueprintjs/core'

export function Footer(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.LIGHT_GRAY4,
        marginTop: 8,
        borderRadius: 4,
        padding: 5,
        userSelect: 'none',
      }}>
      {props.children}
    </div>
  )
}
