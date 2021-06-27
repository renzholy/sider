import { CSSProperties, useCallback, useState, useEffect, useMemo } from 'react'
import { Button } from '@blueprintjs/core'
import { debounce } from 'lodash'

export default function ReloadButton(props: {
  style?: CSSProperties
  isLoading: boolean
  onReload(): void
}) {
  const [isLoading, setisLoading] = useState(false)
  const handleIsLoading = useCallback((_isLoading: boolean) => {
    setisLoading(_isLoading)
  }, [])
  const handleDebounceIsLoading = useMemo(
    () => debounce(handleIsLoading, 500, { leading: true }),
    [handleIsLoading],
  )
  useEffect(() => {
    handleDebounceIsLoading(props.isLoading)
  }, [handleDebounceIsLoading, props.isLoading])

  return (
    <div style={props.style}>
      <Button
        icon="refresh"
        minimal={true}
        disabled={isLoading}
        onClick={props.onReload}
      />
    </div>
  )
}
