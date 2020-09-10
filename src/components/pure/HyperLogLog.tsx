import React from 'react'
import { InputGroup, Button, Colors } from '@blueprintjs/core'

import { useIsDarkMode } from '@/hooks/use-is-dark-mode'

export function HyperLogLog(props: { value: string }) {
  const isDarkMode = useIsDarkMode()

  return (
    <div style={{ flex: 1 }}>
      <InputGroup
        placeholder="PFADD"
        large={true}
        rightElement={<Button icon="plus" minimal={true} />}
        style={{
          backgroundColor: isDarkMode ? Colors.DARK_GRAY4 : Colors.LIGHT_GRAY4,
          boxShadow: 'none',
          outline: 'none',
        }}
      />
    </div>
  )
}
