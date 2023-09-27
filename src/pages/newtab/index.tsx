import { createRoot } from 'react-dom/client'
import NewTab from './NewTab'
import './index.css'

const rootContainer = document.querySelector('#__root')
if (!rootContainer) throw new Error("Can't find New Tab root element")
const root = createRoot(rootContainer)
root.render(<NewTab />)
