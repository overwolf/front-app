import { renderNotices } from './components/Notices/Notices'

import './styles/global.scss'

const start = async () => {
  const root = document.createElement('div')

  document.body.appendChild(root)

  renderNotices(root)
}

start().catch(console.error)
