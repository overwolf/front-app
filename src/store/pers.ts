import { makeNiceState, StateManager, Viewport } from 'ow-libs'

import { kAppScreens, kMatchEndActions } from '../config/enums'

export interface PersState {
  screen: kAppScreens
  launcherStart: boolean
  matchStart: boolean
  matchEndAction: kMatchEndActions
  notifications: boolean
  showChangelog: boolean
  desktopPositionedFor: Viewport | null
  ingamePositionedFor: Viewport | null
  noticesPositionedFor: Viewport | null
}

export const kPersStateDefaults: PersState = {
  screen: kAppScreens.Main,
  launcherStart: true,
  matchStart: true,
  matchEndAction: kMatchEndActions.Show,
  notifications: true,
  showChangelog: true,
  desktopPositionedFor: null,
  ingamePositionedFor: null,
  noticesPositionedFor: null
}

export const kPersStoreName = 'persistent'

/** Store that persists between sessions */
export const makePersStore = () => {
  return makeNiceState(
    new StateManager(kPersStoreName, kPersStateDefaults, true)
  )
}
