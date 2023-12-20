import { renderIngame } from './components/Ingame/Ingame'

import './styles/global.scss'

const start = async () => {
  const root = document.createElement('div')

  document.body.appendChild(root)

  renderIngame(root)
}

start().catch(console.error)
