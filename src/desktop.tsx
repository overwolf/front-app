import { renderDesktop } from './components/Desktop/Desktop'

import './styles/global.scss'

const start = async () => {
  const root = document.createElement('div')

  document.body.appendChild(root)

  renderDesktop(root)
}

start().catch(console.error)
