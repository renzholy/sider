import { padStart } from 'lodash'

export function str2hex(str: string): string {
  let result = ''
  for (let i = 0; i < str.length; i += 1) {
    result += padStart(str.charCodeAt(i).toString(16), 4, '0')
    result += ' '
  }
  return result
}
