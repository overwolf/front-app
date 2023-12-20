import { useEffect, useState } from 'react'
import { HotkeyChangedEvent, HotkeyService, WindowTunnel } from 'ow-libs'

import { kHotkeyServiceName } from '../config/constants'


// get HotkeysService instance from background window
const hotkeysService = WindowTunnel.get<HotkeyService>(kHotkeyServiceName)

const kUnassignedText = 'Unassigned'

export function useHotkey(hotkeyName: string) {
  const [binding, setBinding] = useState(() => {
    return hotkeysService.getHotkeyBinding(hotkeyName)
  })

  const assign = (
    virtualKey: number,
    modifiers: overwolf.settings.hotkeys.HotkeyModifiers
  ) => {
    return hotkeysService.assignHotkey({
      name: hotkeyName,
      virtualKey,
      modifiers
    })
  }

  const unassign = () => {
    return hotkeysService.unassignHotkey({ name: hotkeyName })
  }

  useEffect(() => {
    const binding = hotkeysService.getHotkeyBinding(hotkeyName)
      ?? kUnassignedText

    setBinding(binding)
  }, [hotkeyName])

  useEffect(() => {
    const onHotkeyChanged = (e: HotkeyChangedEvent) => {
      if (e.name === hotkeyName) {
        const binding = hotkeysService.getHotkeyBinding(hotkeyName)
          ?? kUnassignedText

        setBinding(binding)
      }
    }

    hotkeysService.addListener('changed', onHotkeyChanged)

    return () => {
      hotkeysService.removeListener('changed', onHotkeyChanged)
    }
  }, [hotkeyName])

  return {
    binding,
    assign,
    unassign
  }
}
