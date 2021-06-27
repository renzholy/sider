import { useEffect } from 'react'
import useIsDarkMode from 'hooks/use-is-dark-mode'
import { useMonaco } from '@monaco-editor/react'
import useSWR from 'swr'

export default function useColorize(str: string) {
  const isDarkMode = useIsDarkMode()
  const monaco = useMonaco()
  useEffect(() => {
    if (!monaco) {
      return
    }
    monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs')
  }, [isDarkMode, monaco])
  const { data } = useSWR(monaco ? ['colorize', monaco, str] : null, () =>
    monaco!.editor.colorize(str, 'javascript'),
  )
  return data || str
}
