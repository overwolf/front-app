import { useState, createElement, AnimationEventHandler, useMemo, ReactNode, useEffect, useId, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { delay } from 'ow-libs'

import { classNames } from '../../utils'

import './Tip.scss'


type HorizontalPosition =
  'left' |
  'leftEdge' |
  'center' |
  'right' |
  'rightEdge'

type VerticalPosition =
  'top' |
  'topEdge' |
  'center' |
  'bottomEdge' |
  'bottom'

type TipProps = {
  left?: string
  top?: string
  right?: string
  bottom?: string
  width?: string
  position?: `${HorizontalPosition} ${VerticalPosition}`
  arrowPosition?: `${HorizontalPosition} ${VerticalPosition}`
  clickThrough?: boolean
  className?: string
  children?: ReactNode
}

const enum kTipState {
  Hidden,
  Shown,
  FadingOut
}

const
  kArrowWidth = 16,
  kArrowHeight = 8,
  kMargin = 8,
  kPadding = 16

export function Tip({
  left: areaLeft = '',
  top: areaTop = '',
  right: areaRight = '',
  bottom: areaBottom = '',
  width,
  position = 'center bottom',
  arrowPosition: arrowPositionSrc = 'center top',
  clickThrough = false,
  className = '',
  children
}: TipProps) {
  const tipID = useId()

  const
    [mouseOver, setMouseOver] = useState(false),
    [state, setState] = useState(kTipState.Hidden)

  const
    [tipElement, setTipElement] = useState<HTMLElement | null>(null),
    [areaElement, setAreaElement] = useState<HTMLElement | null>(null)

  const arrowPosition = useMemo(
    () => arrowPositionSrc ?? position,
    [arrowPositionSrc, position]
  )

  const left = useMemo(() => {
    if (
      !areaElement ||
      !tipElement ||
      !tipElement.clientWidth ||
      state === kTipState.Hidden
    ) {
      return 0
    }

    const coords = areaElement.getBoundingClientRect()

    const horPosition = position.split(' ')[0]

    let left = 0

    switch (horPosition) {
      case 'left':
        left = coords.left - kMargin - kArrowHeight - tipElement.clientWidth
        break
      case 'leftEdge':
        left = coords.left - kPadding
        break
      case 'right':
        left = coords.right + kArrowHeight + kMargin
        break
      case 'rightEdge':
        left = coords.right + kPadding - tipElement.clientWidth
        break
      case 'center':
        left = coords.left + (coords.width / 2) - (tipElement.clientWidth / 2)
    }

    return Math.max(Math.round(left), 0)
  }, [areaElement, tipElement, state, position])

  const top = useMemo(() => {
    if (
      !areaElement ||
      !tipElement ||
      !tipElement.clientHeight ||
      state === kTipState.Hidden
    ) {
      return 0
    }

    const coords = areaElement.getBoundingClientRect()

    const verPosition = position.split(' ')[1]

    let top = 0

    switch (verPosition) {
      case 'top':
        top = coords.top - kMargin - kArrowHeight - tipElement.clientHeight
        break
      case 'topEdge':
        top = coords.top - kPadding
        break
      case 'center':
        top = ((coords.top + coords.bottom) / 2) - (tipElement.clientHeight / 2)
        break
      case 'bottomEdge':
        top = coords.bottom - tipElement.clientHeight + kPadding
        break
      case 'bottom':
        top = coords.bottom + kMargin + kArrowHeight
    }

    return Math.max(Math.round(top), 0)
  }, [areaElement, tipElement, state, position])

  const arrowLeft = useMemo(() => {
    if (!areaElement || state === kTipState.Hidden) {
      return 0
    }

    const coords = areaElement.getBoundingClientRect()

    const horPosition = arrowPosition.split(' ')[0]

    let left = 0

    switch (horPosition) {
      case 'left':
        left = coords.left - (kArrowHeight / 2) - kMargin
        break
      case 'leftEdge':
        left = coords.left + (kArrowWidth / 2)
        break
      case 'right':
        left = coords.right + (kArrowHeight / 2) + kMargin
        break
      case 'rightEdge':
        left = coords.right - (kArrowWidth / 2)
        break
      case 'center':
        left = coords.left + (coords.width / 2)
    }

    return Math.round(left)
  }, [areaElement, arrowPosition, state])

  const arrowTop = useMemo(() => {
    if (!areaElement || state === kTipState.Hidden) {
      return 0
    }

    const coords = areaElement.getBoundingClientRect()

    const verPosition = arrowPosition.split(' ')[1]

    let top = 0

    switch (verPosition) {
      case 'top':
        top = coords.top - (kArrowHeight / 2) - kMargin
        break
      case 'topEdge':
        top = coords.top + (kArrowWidth / 2)
        break
      case 'center':
        top = ((coords.top + coords.bottom) / 2)
        break
      case 'bottomEdge':
        top = coords.bottom - (kArrowWidth / 2)
        break
      case 'bottom':
        top = coords.bottom + (kArrowHeight / 2) + kMargin
    }

    return Math.round(top)
  }, [areaElement, arrowPosition, state])

  const onAnimationEnd: AnimationEventHandler<HTMLDivElement> = useCallback(e => {
    if (
      state === kTipState.FadingOut &&
      e.animationName === 'TipLayer-fade-out'
    ) {
      // console.log('onAnimationEnd()')
      setState(kTipState.Hidden)
    }
  }, [state])

  /* const onClick = () => {
    setState(v => {
      switch (v) {
        case kTipState.Hidden:
          return kTipState.Shown
        case kTipState.Shown:
          return kTipState.FadingOut
        case kTipState.FadingOut:
          return kTipState.FadingOut
      }
    })
  } */

  const onClick = (e: React.MouseEvent) => {
    if (!clickThrough) {
      e.stopPropagation()
    }
  }

  const onMouseEnter = () => {
    setMouseOver(true)
  }

  const onMouseLeave = () => {
    setMouseOver(false)
  }

  const renderedTipElement = useMemo(() => (
    <div
      className={classNames(
        'TipLayer',
        { 'fade-out': state === kTipState.FadingOut }
      )}
      onAnimationEnd={onAnimationEnd}
    >
      <div
        className={classNames(
          'arrow',
          arrowPosition.split(' ').join('-'),
        )}
        style={{
          left: `${arrowLeft}px`,
          top: `${arrowTop}px`
        }}
      />
      <div
        className="content"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width
        }}
        ref={node => setTipElement(node)}
      >{children}</div>
    </div>
  ), [onAnimationEnd, state, arrowPosition, arrowLeft, arrowTop, left, top, width, children])

  useEffect(() => {
    if (!mouseOver && state !== kTipState.Shown) {
      return
    }

    let cancelled = false

    const timeout = mouseOver ? 250 : 500

    delay(timeout).then(() => {
      if (cancelled) {
        return
      }

      if (mouseOver) {
        setState(kTipState.Shown)
      } else if (state === kTipState.Shown) {
        setState(kTipState.FadingOut)
      }
    })

    return () => {
      cancelled = true
    }
  }, [state, mouseOver])

  /* useEffect(() => {
    if (state !== kTipState.Shown || !areaElement) {
      return
    }

    const onClickOutside = (e: MouseEvent) => {
      if (
        e.button === 0 &&
        areaElement !== e.target &&
        !areaElement.contains(e.target as Node)
      ) {
        setState(kTipState.FadingOut)
      }
    }

    document.addEventListener('click', onClickOutside)

    return () => {
      document.removeEventListener('click', onClickOutside)
    }
  }, [areaElement, state]) */

  return createElement(
    'div',
    {
      className: classNames('Tip', className),
      onClick,
      onMouseEnter,
      onMouseLeave,
      ref: node => setAreaElement(node),
      style: {
        left: areaLeft,
        top: areaTop,
        right: areaRight,
        bottom: areaBottom
      }
    },
    (state !== kTipState.Hidden && children)
      ? createPortal(renderedTipElement, document.body, `Tip-${tipID}`)
      : null
  )
}
