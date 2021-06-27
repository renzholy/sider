import { useState, useEffect } from 'react'

export default function useIsDarkMode(): boolean {
  const [isDarkMode, setIsDarkMode] = useState(false)
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
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
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
