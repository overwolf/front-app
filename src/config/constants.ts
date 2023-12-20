import { kNoticeActions, kNoticeIcons } from './enums'
import { Notice, Toast } from './types'

export const kDevMode = (process.env.NODE_ENV !== 'production')

export const kHotkey = 'toggle-front-app'

export const kHotkeyServiceName = 'HotkeyService'
export const kEventBusName = 'EventBus'

export const kDefaultLocale = 'en-GB'

export const kDiscordUrl = 'https://discord.gg/overwolf-developers'

export const kGameFeatures = [
  'match_info'
]

export const kLeagueLauncherId = 10902
export const kLeagueGameId = 5426

export const kNoticesWidth = 500
export const kNoticesHeight = 800

export const kLoadingLeft = 40
export const kLoadingTop = 200

export const kNoticeDefaultTimeout = 7000

export const kNoticeError: Notice = {
  id: 'notice-error',
  message: 'An error has occurred',
  icon: kNoticeIcons.StatusError,
  devTip: `<h6>Unexpected Error</h6>
<p>Similar to the Yellow state visually but triggered automatically, unexpected errors trigger an automated message to users warning them about the issue.</p>
<p>This real time error can occur on server timeouts, API failures, slow loading times, and any other unexpected loss of functionality which doesn't fully crash the app.</p>`
}

export const kNoticeWarning: Notice = {
  id: 'notice-warning',
  message: 'App is having issues',
  icon: kNoticeIcons.StatusWarning,
  action: {
    id: kNoticeActions.TriggerLaunch,
    text: 'Try again'
  },
  devTip: `<h6>Unexpected Error</h6>
<p>Similar to the Yellow state visually but triggered automatically, unexpected errors trigger an automated message to users warning them about the issue.</p>
<p>This real time error can occur on server timeouts, API failures, slow loading times, and any other unexpected loss of functionality which doesn't fully crash the app.</p>`
}

export const kNoticeStatsReady: Notice = {
  id: 'notice-stats-ready',
  message: 'This is a Quick notification',
  action: {
    id: kNoticeActions.TriggerLaunch,
    text: 'Action button'
  },
  devTip: `<h6>Quick Notifications</h6>
<p>We use notifications to ensure our users are aware of what's happening, or called to act in cases such as recording stopped, in-game stats are ready, a friend logged and more.</p>
<p>We recommend to auto-terminate quick notifications after a few seconds, especially in games where mouse cursor is hidden (like First Person Shooters)</p>`
}

export const kNoticeGameModeUnsupported: Notice = {
  id: 'notice-unsupported',
  message: 'Unsupported Game Mode',
  devTip: `<h6>Unsupported Game Modes</h6>
<p>If your app does not support some of the available game modes, you should consider letting your users know.</p>
<p>Optional courses of action could be posting a small notification, detailing supported game modes in a loading screen or even ignoring this issue altogether.</p>`
}

const kFeedbackToastDevTip = `<h6>Action Feedback</h6>
<p>Make sure that after the "Send/Submit" button is pressed, you provide feedback to the user to let them know that their form has been successfully submitted or if there was an issue allowing them to retry.</p>`

export const kToastFeedbackSubmitted: Toast = {
  id: 'toast-feedback-submitted',
  type: 'success',
  message: 'The feedback was sent successfully!',
  devTip: kFeedbackToastDevTip
}


export const kToastBugReportSubmitted: Toast = {
  id: 'toast-bug-report-submitted',
  type: 'success',
  message: 'Your bug report was sent successfully!',
  devTip: kFeedbackToastDevTip
}
