import { runtime } from 'webextension-polyfill'

export interface State {
  enabled: boolean
}

export function sendMessage(name: string, params: { state?: State }) {
  try {
    runtime.sendMessage({ name, ...params })
  } catch (e) {
    console.log('Error sending message', e)
  }
}
