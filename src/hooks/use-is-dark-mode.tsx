import { useState, useEffect } from 'react'

export function useIsDarkMode(): boolean {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  useEffect(() => {
    function darkListener(e: MediaQueryListEvent) {
      if (e.matches) {
        setIsDarkMode(true)
      }
    }
    function lightListener(e: MediaQueryListEvent) {
      if (e.matches) {
        setIsDarkMode(false)
      }
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', darkListener)
    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', lightListener)
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', darkListener)
      window
        .matchMedia('(prefers-color-scheme: light)')
        .removeEventListener('change', lightListener)
    }
  }, [])
  return isDarkMode
}
