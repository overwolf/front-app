import { EventEmitter, LauncherStatus, GameStatus, OverwolfWindow, WindowTunnel, log, delay, HotkeyService, HotkeyChangedEvent } from 'ow-libs'

import { kEventBusName, kDiscordUrl, kNoticeWarning, kNoticeError, kNoticeGameModeUnsupported, kNoticeStatsReady, kLeagueLauncherId, kNoticesHeight, kNoticesWidth, kLoadingLeft, kLoadingTop, kHotkey, kHotkeyServiceName, kToastFeedbackSubmitted, kToastBugReportSubmitted } from './config/constants'
import { kWindowNames, kAppStatus, kMatchEndActions } from './config/enums'

import { makeCommonStore } from './store/common'
import { makePersStore } from './store/pers'
import { EventBusEvents, Notice, Toast } from './config/types'


class BackgroundController {
  readonly #eventBus = new EventEmitter<EventBusEvents>()
  readonly #launcherStatus = new LauncherStatus()
  readonly #gameStatus = new GameStatus()
  readonly #hotkey = new HotkeyService()
  readonly #state = makeCommonStore()
  readonly #persState = makePersStore()
  readonly #backgroundWin = new OverwolfWindow(kWindowNames.background)
  readonly #desktopWin = new OverwolfWindow(kWindowNames.desktop)
  readonly #ingameWin = new OverwolfWindow(kWindowNames.ingame)
  readonly #loadingWin = new OverwolfWindow(kWindowNames.loading)
  readonly #noticesWin = new OverwolfWindow(kWindowNames.notices)

  #uid = 0

  get startedWithLauncher() {
    return (
      window.location.search.includes('source=gamelaunchevent') &&
      window.location.search.includes(`gameid=${kLeagueLauncherId}`)
    )
  }

  get startedWithGame() {
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
      console.log('Front App started app version:', e.meta.version)
      this.#state.version = e.meta.version
    })

    this.#initTunnels()

    await Promise.all([
      this.#launcherStatus.start(),
      this.#gameStatus.start(),
      this.#hotkey.start(),
      this.#updateViewports()
    ])

    this.#state.hotkey = this.#hotkey.getHotkeyBinding(kHotkey)

    this.#eventBus.on({
      setStatus: status => this.#state.status = status,
      setScreen: screen => this.#state.screen = screen,
      setPopup: popup => this.#state.popup = popup,
      dragWindow: windowName => this.dragWindow(windowName),
      minimizeWindow: windowName => this.minimizeWindow(windowName),
      closeWindow: windowName => this.closeWindow(windowName),
      positionWindow: windowName => this.#positionWindow(windowName),
      openLink: url => this.#openLink(url),
      triggerLaunch: () => this.#openMainWindow(),
      openDiscord: () => this.#openLink(kDiscordUrl),
      closeNotice: id => this.#closeNotice(id),
      closeApp: () => this.#closeApp(),
      tryAgain: () => this.#tryAgain(),
      closeToast: id => this.#closeToast(id),
      submitFeedback: () => this.#submitFeedback(),
      submitBugReport: () => this.#submitBugReport(),
      setSetting: ([key, value]) => (this.#persState[key] as any) = value
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

    this.#onGameRunningChanged()
    this.#onLauncherRunningChanged()

    overwolf.windows.onMainWindowRestored.addListener(() => {
      this.#openMainWindow()
    })

    if (!this.startedWithLauncher && !this.startedWithGame) {
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

  #onHotkeyChanged(e: HotkeyChangedEvent) {
    console.log('onHotkeyChanged():', e.name, e.binding)

    switch (e.name) {
      case kHotkey:
        this.#state.hotkey = e.binding
        break
    }
  }

  async #onHotkeyPressed(name: string) {
    console.log('onHotkeyPressed():', name)

    switch (name) {
      case kHotkey:
        await this.#openMainWindow('hotkey')
        break
    }
  }

  async #onGameRunningChanged() {
    this.#state.gameRunning = this.#gameStatus.isRunning

    if (this.#gameStatus.isRunning) {
      await this.#onGameLaunched()
    } else {
      await this.#onGameClosed()
    }
  }

  async #onLauncherRunningChanged() {
    this.#state.launcherRunning = this.#launcherStatus.isRunning

    if (this.#launcherStatus.isRunning && this.#persState.launcherStart) {
      await this.#desktopWin.restore()
    }
  }

  async #onGameLaunched() {
    console.log(
      'onGameLaunched()',
      this.#gameStatus.gameID,
      this.#gameStatus.gameInfo?.title
    )

    this.#state.gameRunning = true

    await this.#desktopWin.close()

    await this.#onMatchStart()
  }

  async #onGameClosed() {
    console.log('onGameClosed()', this.#gameStatus.gameID)

    this.#state.gameRunning = false

    await this.#ingameWin.close()
    await this.#loadingWin.close()

    await this.#onMatchEnd()
  }

  async #tryAgain() {
    this.#state.status = kAppStatus.Normal
    this.#state.statsReady = false

    await delay(7000)

    this.#state.statsReady = true
  }

  async #onMatchStart() {
    if (!this.#persState.matchStart) {
      return
    }

    console.log('onMatchStart()')

    await this.#loadingWin.restore()

    this.#state.statsReady = false

    await delay(7000)

    this.#state.statsReady = true

    await this.#showMatchStartNotice()
  }

  async #onMatchEnd() {
    console.log('onMatchEnd()')

    if (this.#persState.matchEndAction === kMatchEndActions.Show) {
      if (this.#gameStatus.isInFocus) {
        await this.#desktopWin.restore()
      } else {
        await this.#ingameWin.restore()
      }
    }
  }

  async #openMainWindow(origin?: string) {
    console.log('openMainWindow()', origin)

    if (this.#gameStatus.isInFocus) {
      if (this.#state.statsReady) {
        await this.#loadingWin.close()

        if (origin === 'hotkey') {
          await this.#ingameWin.toggle()
        } else {
          await this.#ingameWin.restore()
        }
      } else {
        if (origin === 'hotkey') {
          await this.#loadingWin.toggle()
        } else {
          await this.#loadingWin.restore()
        }
      }
    } else {
      if (origin === 'hotkey') {
        await this.#desktopWin.toggle()
      } else {
        await this.#desktopWin.restore()
      }
    }
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
    overwolf.utils.openUrlInDefaultBrowser(url)
  }

  dragWindow(windowName: kWindowNames) {
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

  minimizeWindow(windowName: kWindowNames) {
    switch (windowName) {
      case kWindowNames.desktop:
        this.#desktopWin.minimize()
        break
      case kWindowNames.ingame:
        this.#ingameWin.minimize()
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

  #positionDesktopWindow() {
    const { viewport } = this.#state
    const { desktopPositionedFor } = this.#persState

    if (
      viewport &&
      desktopPositionedFor &&
      viewport.hash === desktopPositionedFor.hash
    ) {
      this.#desktopWin.centerInViewport(viewport)
      this.#persState.desktopPositionedFor = viewport
    }
  }

  #positionIngameWindow() {
    const { viewport } = this.#state
    const { ingamePositionedFor } = this.#persState

    if (
      viewport &&
      ingamePositionedFor &&
      viewport.hash === ingamePositionedFor.hash
    ) {
      this.#ingameWin.centerInViewport(viewport)
      this.#persState.ingamePositionedFor = viewport
    }
  }

  #positionLoadingWindow() {
    this.#ingameWin.changePosition(kLoadingLeft, kLoadingTop)
  }

  #positionNoticesWindow() {
    const { viewport } = this.#state
    const { noticesPositionedFor } = this.#persState

    if (!viewport) {
      return
    }

    console.log(
      'positionNoticesWindow():',
      viewport,
      noticesPositionedFor
    )

    if (
      noticesPositionedFor &&
      viewport.hash === noticesPositionedFor.hash
    ) {
      return
    }

    const
      viewportLogicalWidth = viewport.width / viewport.scale,
      viewportLogicalHeight = viewport.height / viewport.scale,
      logicalLeft = viewportLogicalWidth - kNoticesWidth - 20,
      logicalTop = viewportLogicalHeight - kNoticesHeight - 60,
      left = Math.round(Math.floor(logicalLeft) * viewport.scale),
      top = Math.round(Math.floor(logicalTop) * viewport.scale)

    this.#persState.noticesPositionedFor = viewport

    this.#noticesWin.changePosition(left, top)
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
