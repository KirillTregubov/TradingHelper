// console.log('run once')
// const iframes = document.getElementsByTagName('iframe')
// for (const iframe of iframes) {
//     if (iframe.src === "https://trade.fundednext.com/terminal")

let terminal: null | Document = null
export function getTerminal() {
  if (terminal) return terminal
  const iframe = document.querySelector(
    'iframe[src="https://trade.fundednext.com/terminal"]'
  ) as HTMLIFrameElement
  if (!iframe || !iframe.contentWindow) return null
  try {
    iframe.contentWindow.document
  } catch (e) {
    console.error('Permission denied. Please run Chrome in insecure mode.')
    return null
  }
  terminal = iframe.contentWindow.document
  return terminal
}

export function showError(issue: string) {
  alert(
    `Error ${issue}, please make sure only the Order panel is open. Contact the developer if the issue persists.`
  )
}
