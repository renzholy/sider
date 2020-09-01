import React, {
  CSSProperties,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react'
import { Spinner, Button } from '@blueprintjs/core'
import { debounce } from 'lodash'

export function ReloadButton(props: {
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

  return isLoading ? (
    <div
      style={{
        ...props.style,
        width: 30,
        paddingRight: 7,
      }}>
      <Spinner size={16} />
    </div>
  ) : (
    <div style={props.style}>
      <Button icon="refresh" minimal={true} onClick={props.onReload} />
    </div>
  )
}
