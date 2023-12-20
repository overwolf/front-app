import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { L } from 'ow-libs'

import { useHotkey } from '../../hooks/use-hotkey'
import { kKeyCodes } from '../../config/key-codes'
import { classNames } from '../../utils'

import './HotkeyEditor.scss'

const kHotkeyUsedErrorPrefix = 'Hotkey is already used by '

function getKeyName(code: number): string {
  if (kKeyCodes[code]) {
    return kKeyCodes[code]
  }

  return `Key #${code}`
}

function isModifierKey(code: number) {
  switch (code) {
    case 16:
    case 17:
    case 18:
    case 160:
    case 161:
    case 162:
    case 163:
    case 164:
    case 165:
      return true
  }

  return false
}

function isAltKey(code: number) {
  switch (code) {
    case 18:
    case 164:
    case 165:
      return true
  }

  return false
}

function isCtrlKey(code: number) {
  switch (code) {
    case 17:
    case 162:
    case 163:
      return true
  }

  return false
}

function isShiftKey(code: number) {
  switch (code) {
    case 16:
    case 160:
    case 161:
      return true
  }

  return false
}

function isForbiddenKey(code: number) {
  switch (code) {
    case 91:
    case 92:
    case 93:
      return true
  }

  return false
}

export function HotkeyEditor({ hotkeyName }: { hotkeyName: string }) {
  const editorEl = useRef(null)

  const {
    binding: hotkeyBinding,
    assign
  } = useHotkey(hotkeyName)

  const
    [editing, setEditing] = useState(false),
    [alt, setAlt] = useState(false),
    [ctrl, setCtrl] = useState(false),
    [shift, setShift] = useState(false),
    [error, setError] = useState('')

  const keysText = useMemo(() => {
    if (!editing) {
      return hotkeyBinding.split('+').join(' + ')
    }

    if (error) {
      return error
    }

    if (!alt && !ctrl && !shift) {
      return 'Choose key'
    }

    const out: string[] = []

    if (shift) {
      out.unshift('Shift')
    }

    if (ctrl) {
      out.unshift('Ctrl')
    }

    if (alt) {
      out.unshift('Alt')
    }

    return out.join(' + ')
  }, [editing, error, alt, ctrl, shift, hotkeyBinding])

  const resetEditing = () => {
    setEditing(true)
    setAlt(false)
    setCtrl(false)
    setShift(false)
  }

  const assignAndStopEditing = useCallback(async (key: number) => {
    console.log(
      'assignAndStopEditing()',
      getKeyName(key),
      ...L({ ctrl, shift, alt })
    )

    const result = await assign(key, { ctrl, shift, alt })

    console.log('assignAndStopEditing() result:', ...L(result))

    if (result.success) {
      setEditing(false)
      setError('')
    } else {
      let newError: string

      if (result.error && result.error.startsWith(kHotkeyUsedErrorPrefix)) {
        newError = 'Hotkey taken'
      } else {
        newError = result.error || 'Unknown error'
      }

      setError(newError)
      resetEditing()

      setTimeout(() => {
        if (error === newError) {
          setError('')
        }
      }, 3000)
    }
  }, [ctrl, shift, alt, assign, error])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!editing) {
        return
      }

      e.stopPropagation()
      e.preventDefault()

      if (isForbiddenKey(e.keyCode)) {
        return
      }

      if (isCtrlKey(e.keyCode)) {
        setCtrl(true)
      } else if (isShiftKey(e.keyCode)) {
        setShift(true)
      } else if (isAltKey(e.keyCode)) {
        setAlt(true)
      } else if (!isModifierKey(e.keyCode)) {
        assignAndStopEditing(e.keyCode)
      }
    }

    const onWindowClick = (e: MouseEvent) => {
      if (
        editing &&
        editorEl.current &&
        !e.composedPath().includes(editorEl.current)
      ) {
        setEditing(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('click', onWindowClick)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('click', onWindowClick)
    }
  }, [assignAndStopEditing, editing])

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (!editing) {
        return
      }

      e.stopPropagation()
      e.preventDefault()

      if (isForbiddenKey(e.keyCode)) {
        return
      }

      if (isCtrlKey(e.keyCode)) {
        setCtrl(false)
      } else if (isShiftKey(e.keyCode)) {
        setShift(false)
      } else if (isAltKey(e.keyCode)) {
        setAlt(false)
      }
    }

    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [editing])

  return (
    <div
      className={classNames('HotkeyEditor', { editing, error: !!error })}
      onClick={resetEditing}
      ref={editorEl}
    >{keysText}</div>
  )
}
