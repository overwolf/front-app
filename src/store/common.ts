import { makeNiceState, StateManager, Viewport } from 'ow-libs'

import { kAppStatus, kAppScreens, kAppPopups } from '../config/enums'
import { Notice, Toast } from '../config/types'


export interface CommonState {
  status: kAppStatus
  screen: kAppScreens
  popup: kAppPopups | null
  launcherRunning: boolean
  gameRunning: boolean
  gameFocused: boolean
  statsReady: boolean
  viewport: Viewport | null
  notices: Notice[]
  toasts: Toast[]
  hotkey: string
  hotkeyLoading: string
  version: string
}

export const kCommonStoreDefauts: CommonState = {
  status: kAppStatus.Normal,
  screen: kAppScreens.Main,
  popup: null,
  launcherRunning: false,
  gameRunning: false,
  gameFocused: false,
  statsReady: false,
  viewport: null,
  notices: [],
  toasts: [],
  hotkey: '',
  hotkeyLoading: '',
  version: ''
}

export const kCommonStoreName = 'common'

/**
 * Store that is shared between all windows. Doesn't persist between sessions
 */
export const makeCommonStore = () => {
  return makeNiceState(
    new StateManager(kCommonStoreName, kCommonStoreDefauts)
  )
}
