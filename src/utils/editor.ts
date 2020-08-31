import { monaco, Monaco, ControlledEditor } from '@monaco-editor/react'

import { Deferred } from './deferred'

const _monaco = new Deferred<Monaco>()

monaco
  .init()
  .then((_m) => {
    _monaco.resolve(_m)
  })
  .catch((err) => {
    _monaco.reject(err)
  })

export async function colorize(
  text: string,
  isDarkMode: boolean,
): Promise<string> {
  ;(await _monaco.promise).editor.setTheme(isDarkMode ? 'vs-dark' : 'vs')
  return (
    (await _monaco.promise).editor.colorize(text, 'javascript', {
      tabSize: 2,
    }) || ''
  )
}

export { ControlledEditor }
