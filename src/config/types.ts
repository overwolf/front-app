import { PersState } from '../store/pers'
import { kAppPopups, kAppStatus, kAppScreens, kNoticeActions, kNoticeIcons, kWindowNames } from './enums'

type SetSetting<T extends keyof PersState = keyof PersState> = [T, PersState[T]]

export interface EventBusEvents {
  dragWindow: kWindowNames
  minimizeWindow: kWindowNames
  closeWindow: kWindowNames
  positionWindow: kWindowNames
  setPopup: kAppPopups | null
  setScreen: kAppScreens
  setStatus: kAppStatus
  openLink: string
  triggerLaunch: void
  openDiscord: void
  noticeAction: kNoticeActions
  closeNotice: string
  closeApp: void
  tryAgain: void
  setSetting: SetSetting
  submitFeedback: void
  submitBugReport: void
  closeToast: string
  setFTUESeen: void
}

export interface NoticeAction {
  text: string
  id: kNoticeActions
}

export interface Notice {
  id: string
  message: string
  icon?: kNoticeIcons
  devTip?: string
  action?: NoticeAction
  timeout?: number
}

export interface GameEventTypes {
  'events.match_start': void
  'events.match_end': void
  'events.matchStart': void
  'events.matchEnd': void
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  timeout?: number
  devTip?: string
}
