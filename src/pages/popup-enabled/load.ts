import { runtime } from 'webextension-polyfill'

window.onload = function () {
  runtime.sendMessage('popup_loaded')
}
