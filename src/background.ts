import { EventEmitter, LauncherStatus, GameStatus, OverwolfWindow, WindowTunnel, log, delay, HotkeyService, HotkeyChangedEvent, GameEvents } from 'ow-libs'

import { kEventBusName, kDiscordUrl, kNoticeWarning, kNoticeError, kNoticeGameModeUnsupported, kNoticeStatsReady, kLeagueLauncherId, kNoticesHeight, kNoticesWidth, kLoadingLeft, kLoadingTop, kHotkeyApp, kHotkeyServiceName, kToastFeedbackSubmitted, kToastBugReportSubmitted, kHotkeyLoading, kGameFeatures, kLeagueGameId, kLoadingWidth, kMainHeight, kMainWidth, kLoadingHeight } from './config/constants'
import { kWindowNames, kAppStatus, kMatchEndActions } from './config/enums'

import { makeCommonStore } from './store/common'
import { makePersStore } from './store/pers'
import { EventBusEvents, GameEventTypes, Notice, Toast } from './config/types'


class BackgroundController {
  readonly #eventBus = new EventEmitter<EventBusEvents>()
  readonly #launcherStatus = new LauncherStatus()
  readonly #gameStatus = new GameStatus()
  readonly #gameEvents = new GameEvents<GameEventTypes>(
    kGameFeatures,
    this.#gameStatus
  )
  readonly #hotkey = new HotkeyService()
  readonly #state = makeCommonStore()
  readonly #persState = makePersStore()
  readonly #backgroundWin = new OverwolfWindow(kWindowNames.background)
  readonly #desktopWin = new OverwolfWindow(kWindowNames.desktop)
  readonly #ingameWin = new OverwolfWindow(kWindowNames.ingame)
  readonly #loadingWin = new OverwolfWindow(kWindowNames.loading)
  readonly #noticesWin = new OverwolfWindow(kWindowNames.notices)

  #uid = 0

  #isInMatch = false

  get #startedWithLauncher() {
    return (
      window.location.search.includes('source=gamelaunchevent') &&
      window.location.search.includes(`gameid=${kLeagueLauncherId}`)
    )
  }

  get #startedWithGame() {
    return (
      window.location.search.includes('source=gamelaunchevent') &&
      window.location.search.includes('gameid=') &&
      !window.location.search.includes(`gameid=${kLeagueLauncherId}`)
    )
  }

  async start() {
    console.log('Front App starting')

    this.#bindAppShutdown()

    overwolf.extensions.current.getManifest(e => {
      console.log('Front App app version:', e.meta.version)
      this.#state.version = e.meta.version
    })

    this.#initTunnels()

    await Promise.all([
      this.#launcherStatus.start(),
      this.#gameStatus.start(),
      this.#hotkey.start(),
      this.#updateViewports()
    ])

    await this.#initHotkeys()

    this.#eventBus.on({
      setStatus: status => this.#state.status = status,
      setScreen: screen => this.#state.screen = screen,
      setPopup: popup => this.#state.popup = popup,
      dragWindow: windowName => this.#dragWindow(windowName),
      minimizeWindow: windowName => this.#minimizeWindow(windowName),
      closeWindow: windowName => this.closeWindow(windowName),
      positionWindow: windowName => this.#positionWindow(windowName),
      openLink: url => this.#openLink(url),
      openDiscord: () => this.#openLink(kDiscordUrl),
      triggerLaunch: () => this.#openMainWindow(),
      closeNotice: id => this.#closeNotice(id),
      closeApp: () => this.#closeApp(),
      tryAgain: () => this.#tryAgain(),
      closeToast: id => this.#closeToast(id),
      submitFeedback: () => this.#submitFeedback(),
      submitBugReport: () => this.#submitBugReport(),
      setSetting: ([key, value]) => (this.#persState[key] as any) = value,
      setFTUESeen: () => this.#persState.ftueSeen = true
    })

    this.#launcherStatus.addListener('running', () => {
      this.#onLauncherRunningChanged()
    })

    this.#gameStatus.on({
      '*': () => this.#updateViewports(),
      running: () => this.#onGameRunningChanged(),
      focus: () => this.#state.gameFocused = this.#gameStatus.isInFocus
    })

    this.#hotkey.on({
      changed: e => this.#onHotkeyChanged(e),
      pressed: name => this.#onHotkeyPressed(name)
    })

    this.#onGameRunningChanged(true)
    this.#onLauncherRunningChanged()

    overwolf.extensions.onAppLaunchTriggered.addListener(e => {
      console.log('onAppLaunchTriggered():', ...log(e))
      this.#openMainWindow(e.origin)
    })

    if (this.#startedWithLauncher || this.#startedWithGame) {
      if (!this.#persState.autoLaunch) {
        await this.#closeApp()
      }
    } else {
      console.log('Front App started without game or launcher')
      await this.#openMainWindow()
    }

    console.log('Front App started successfully')
  }

  /** Make these objects available to all windows via a WindowTunnel */
  #initTunnels() {
    WindowTunnel.set(kEventBusName, this.#eventBus)
    WindowTunnel.set(kHotkeyServiceName, this.#hotkey)
  }

  #submitFeedback() {
    this.#state.popup = null
    this.#newToast(kToastFeedbackSubmitted)
  }

  #submitBugReport() {
    this.#state.popup = null
    this.#newToast(kToastBugReportSubmitted)
  }

  async #initHotkeys() {
    this.#state.hotkey = this.#hotkey.getHotkeyBinding(kHotkeyApp)
    this.#state.hotkeyLoading = this.#hotkey.getHotkeyBinding(kHotkeyLoading)

    if (!this.#state.hotkey) {
      console.log('setDefaultHotkeys(): assigning default app hotkey')

      await this.#hotkey.assignHotkey({
        name: kHotkeyApp,
        virtualKey: 84,
        modifiers: {
          ctrl: true
        }
      })
    }

    if (!this.#state.hotkeyLoading) {
      console.log('setDefaultHotkeys(): assigning default loading hotkey')

      await this.#hotkey.assignHotkey({
        name: kHotkeyLoading,
        virtualKey: 84,
        modifiers: {
          ctrl: true,
          shift: true
        }
      })
    }
  }

  #onHotkeyChanged(e: HotkeyChangedEvent) {
    console.log('onHotkeyChanged():', e.name, e.binding)

    switch (e.name) {
      case kHotkeyApp:
        this.#state.hotkey = e.binding
        break
      case kHotkeyLoading:
        this.#state.hotkeyLoading = e.binding
        break
    }
  }

  async #onHotkeyPressed(name: string) {
    console.log('onHotkeyPressed():', name)

    switch (name) {
      case kHotkeyApp:
        await this.#openMainWindow('hotkey')
        break
      case kHotkeyLoading:
        await this.#toggleLoadingWindow()
        break
    }
  }

  async #onGameRunningChanged(firstRun = false) {
    this.#state.gameRunning = this.#gameStatus.isRunning

    if (this.#gameStatus.isRunning) {
      await this.#onGameLaunched()
    } else if (!firstRun) {
      await this.#onGameClosed()
    }
  }

  async #onLauncherRunningChanged() {
    this.#state.launcherRunning = this.#launcherStatus.isRunning

    if (this.#launcherStatus.isRunning && this.#persState.autoLaunch) {
      await this.#openMainWindow()
    }
  }

  async #onGameLaunched() {
    console.log(
      'onGameLaunched()',
      this.#gameStatus.gameID,
      this.#gameStatus.gameInfo?.title
    )

    this.#state.gameRunning = true

    this.#desktopWin.close()

    if (this.#gameStatus.gameID === kLeagueGameId) {
      await this.#onMatchStart()
    } else {
      await this.#registerGameEvents()
      await this.#showGameLaunchNotice()
    }
  }

  async #onGameClosed() {
    console.log('onGameClosed()', this.#gameStatus.gameID)

    this.#state.gameRunning = false
    this.#isInMatch = false

    this.#gameEvents.stop()

    await Promise.all([
      this.#ingameWin.close(),
      this.#loadingWin.close()
    ])

    if (this.#gameStatus.gameID === kLeagueGameId) {
      await this.#onMatchEnd()
    }
  }

  async #registerGameEvents() {
    if (this.#gameStatus.gameID === kLeagueGameId) {
      console.log('registerGameEvents(): game is League, skipping')
      return
    }

    console.log('registerGameEvents()')

    this.#gameEvents.on({
      'events.match_start': () => this.#onMatchStart(),
      'events.match_end': () => this.#onMatchEnd(),
      'events.matchStart': () => this.#onMatchStart(),
      'events.matchEnd': () => this.#onMatchEnd()
    })

    await this.#gameEvents.start()
  }

  async #tryAgain() {
    this.#state.status = kAppStatus.Normal
    this.#state.statsReady = false

    await delay(7000)

    this.#state.statsReady = true
  }

  async #onMatchStart() {
    if (!this.#persState.matchStart || this.#isInMatch) {
      return
    }

    console.log('onMatchStart()')

    this.#isInMatch = true

    await Promise.all([
      this.#loadingWin.restore(),
      this.#ingameWin.restore()
    ])

    await this.#showMatchStartNotice()

    this.#state.statsReady = false

    await delay(7000)

    this.#state.statsReady = true
  }

  async #onMatchEnd() {
    if (!this.#isInMatch) {
      return
    }

    this.#isInMatch = false

    console.log('onMatchEnd()')

    if (this.#persState.matchEndAction === kMatchEndActions.Show) {
      if (this.#gameStatus.isInFocus) {
        await this.#ingameWin.restore()
      } else {
        await this.#desktopWin.restore()
      }
    }
  }

  async #toggleLoadingWindow() {
    if (this.#gameStatus.isInFocus) {
      await this.#loadingWin.toggle()
    }
  }

  async #openMainWindow(origin?: string) {
    console.log('openMainWindow()', origin)

    if (this.#gameStatus.isInFocus) {
      if (origin === 'hotkey') {
        await this.#ingameWin.toggle()
      } else {
        await this.#ingameWin.restore()
      }
    } else {
      if (origin === 'hotkey') {
        await this.#desktopWin.toggle()
      } else {
        await this.#desktopWin.restore()
      }
    }
  }

  async #showGameLaunchNotice() {
    if (!this.#persState.notifications) {
      return
    }

    await this.#showNotice({
      id: 'notice-game-launch',
      message: `App is ready!<br />
Press <kbd>${this.#state.hotkey}</kbd> to show the app`,
      devTip: `<h6>Quick Notifications</h6>
<p>We use notifications to ensure our users are aware of what's happening, or called to act in cases such as recording stopped, in-game stats are ready, a friend logged and more.</p>
<p>We recommend to auto-terminate quick notifications after a few seconds, especially in games where mouse cursor is hidden (like First Person Shooters).</p>`
    })
  }

  async #showMatchStartNotice() {
    if (!this.#persState.notifications) {
      return
    }

    switch (this.#state.status) {
      case kAppStatus.Error:
        await this.#showNotice(kNoticeError)
        break
      case kAppStatus.Warning:
        await this.#showNotice(kNoticeWarning)
        break
      case kAppStatus.Normal:
      default:
        await this.#showNotice(kNoticeStatsReady)
    }

    await this.#showNotice(kNoticeGameModeUnsupported)
  }

  async #showNotice(notice: Notice) {
    if (!this.#persState.notifications) {
      return
    }

    await this.#noticesWin.restore()

    await delay(1000)

    const { notices } = this.#state

    notices.push({
      ...notice,
      id: `${notice.id}-${this.#uid++}`
    })

    if (notices.length > 5) {
      notices.shift()
    }

    this.#state.notices = notices
  }

  #closeNotice(id: string) {
    this.#state.notices = this.#state.notices.filter(v => v.id !== id)
  }

  async #updateViewports() {
    const newViewport = await OverwolfWindow.getPrimaryViewport()

    const { viewport } = this.#state

    if (!viewport || viewport?.hash !== newViewport?.hash) {
      this.#state.viewport = newViewport

      console.log('updateViewports():', ...log(newViewport))
    }
  }

  async #closeApp() {
    await Promise.all([
      this.#desktopWin.close(),
      this.#loadingWin.close(),
      this.#ingameWin.close()
    ])

    if (this.#gameStatus.isRunning) {
      console.log('closeApp(): game running, cannot close app')
    } else {
      console.log('closeApp(): closing app')
      await this.#backgroundWin.close()
    }
  }

  #openLink(url: string) {
    console.log('openLink():', url)

    if (url.startsWith('https://')) {
      overwolf.utils.openUrlInDefaultBrowser(url)
    }
  }

  #dragWindow(windowName: kWindowNames) {
    switch (windowName) {
      case kWindowNames.desktop:
        this.#desktopWin.dragMove()
        break
      case kWindowNames.ingame:
        this.#ingameWin.dragMove()
        break
      case kWindowNames.loading:
        this.#loadingWin.dragMove()
        break
      case kWindowNames.notices:
        this.#noticesWin.dragMove()
        break
    }
  }

  #minimizeWindow(windowName: kWindowNames) {
    switch (windowName) {
      case kWindowNames.desktop:
        this.#desktopWin.minimize()
        break
      case kWindowNames.ingame:
        this.#ingameWin.minimize()
        break
      case kWindowNames.loading:
        this.#loadingWin.minimize()
        break
      case kWindowNames.notices:
        this.#noticesWin.minimize()
        break
    }
  }

  closeWindow(windowName: kWindowNames) {
    switch (windowName) {
      case kWindowNames.desktop:
        this.#desktopWin.close()
        break
      case kWindowNames.ingame:
        this.#ingameWin.close()
        break
      case kWindowNames.loading:
        this.#loadingWin.close()
        break
      case kWindowNames.notices:
        this.#noticesWin.close()
        break
    }
  }

  #positionWindow(windowName: kWindowNames) {
    switch (windowName) {
      case kWindowNames.desktop:
        this.#positionDesktopWindow()
        break
      case kWindowNames.ingame:
        this.#positionIngameWindow()
        break
      case kWindowNames.loading:
        this.#positionLoadingWindow()
        break
      case kWindowNames.notices:
        this.#positionNoticesWindow()
        break
    }
  }

  async #positionDesktopWindow() {
    const { viewport } = this.#state
    const { desktopPositionedFor } = this.#persState

    if (!viewport || viewport.hash === desktopPositionedFor?.hash) {
      return
    }

    await this.#desktopWin.changeSize(kMainWidth, kMainHeight, false)
    await this.#desktopWin.centerInViewport(viewport)

    this.#persState.desktopPositionedFor = viewport
  }

  async #positionIngameWindow() {
    const { viewport } = this.#state

    console.log('positionIngameWindow():', viewport)

    if (!viewport) {
      return
    }

    // get scaled viewport size
    const
      viewportWidthScaled = viewport.width / viewport.scale,
      viewportHeightScaled = viewport.height / viewport.scale

    let
      left = viewport.x + (viewportWidthScaled / 2) - (kMainWidth / 2),
      top = viewport.y + (viewportHeightScaled / 2) - (kMainHeight / 2)

    // make sure ingame window doesn't overlap with loading window
    left = Math.max(kLoadingLeft + kLoadingWidth + 15, left)

    // get unscaled position
    left = Math.round(left * viewport.scale)
    top = Math.round(top * viewport.scale)

    await this.#ingameWin.changeSize(kMainWidth, kMainHeight, false)
    await this.#ingameWin.changePosition(left, top)
  }

  async #positionNoticesWindow() {
    const { viewport } = this.#state
    const { noticesPositionedFor } = this.#persState

    if (!viewport || viewport.hash === noticesPositionedFor?.hash) {
      return
    }

    const
      viewportLogicalWidth = viewport.width / viewport.scale,
      viewportLogicalHeight = viewport.height / viewport.scale,
      logicalLeft = viewportLogicalWidth - kNoticesWidth - 20,
      logicalTop = viewportLogicalHeight - kNoticesHeight - 60,
      left = Math.round(Math.floor(logicalLeft) * viewport.scale),
      top = Math.round(Math.floor(logicalTop) * viewport.scale)

    await this.#noticesWin.changePosition(left, top)

    this.#persState.noticesPositionedFor = viewport
  }

  async #positionLoadingWindow() {
    await this.#loadingWin.changeSize(kLoadingWidth, kLoadingHeight, false)
    await this.#loadingWin.changePosition(kLoadingLeft, kLoadingTop)
  }

  #newToast(toast: Toast) {
    const newToast: Toast = {
      ...toast,
      id: `${toast.id}-${this.#uid++}`
    }

    this.#state.toasts = [
      newToast,
      ...this.#state.toasts
    ]
  }

  #closeToast(id: string) {
    this.#state.toasts = this.#state.toasts.filter(v => v.id !== id)
  }

  #bindAppShutdown() {
    window.addEventListener('beforeunload', e => {
      delete e.returnValue

      console.log('Front App shutting down')
    })
  }
}

(new BackgroundController())
  .start()
  .catch(e => {
    console.log('Front app error:')
    console.error(e)
  })
