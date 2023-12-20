import { renderLoading } from './components/Loading/Loading'

import './styles/global.scss'

const start = async () => {
  const root = document.createElement('div')

  document.body.appendChild(root)

  renderLoading(root)
}

start().catch(console.error)
