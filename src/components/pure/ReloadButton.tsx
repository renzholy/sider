import React, {
  CSSProperties,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react'
import { Spinner, Button } from '@blueprintjs/core'
import { throttle } from 'lodash'

export function ReloadButton(props: {
  style?: CSSProperties
  isLoading: boolean
  onReload(): void
}) {
  const [isLoading, setisLoading] = useState(false)
  const handleIsLoading = useCallback((_isLoading: boolean) => {
    setisLoading(_isLoading)
  }, [])
  const handleThrottledIsLoading = useMemo(
    () => throttle(handleIsLoading, 500, { leading: true }),
    [handleIsLoading],
  )
  useEffect(() => {
    handleThrottledIsLoading(props.isLoading)
  }, [handleThrottledIsLoading, props.isLoading])

  return isLoading ? (
    <div
      style={{
        ...props.style,
        width: 30,
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: 7,
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
