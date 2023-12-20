import { useState, createElement, AnimationEventHandler, useMemo, ReactNode, useId, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { classNames } from '../../utils'

import './ToolTip.scss'


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

type ToolTipProps = {
  left?: string
  top?: string
  right?: string
  bottom?: string
  width?: string
  position?: `${HorizontalPosition} ${VerticalPosition}`
  arrowPosition?: `${HorizontalPosition} ${VerticalPosition}`
  className?: string
  children?: ReactNode
}

const enum kToolTipState {
  Hidden,
  Shown,
  FadingOut
}

const
  kArrowWidth = 16,
  kArrowHeight = 8,
  kMargin = 8,
  kPadding = 16

export function ToolTip({
  left: areaLeft = '',
  top: areaTop = '',
  right: areaRight = '',
  bottom: areaBottom = '',
  width,
  position = 'center bottom',
  arrowPosition: arrowPositionSrc = 'center top',
  className = '',
  children
}: ToolTipProps) {
  const tipID = useId()

  const [state, setState] = useState(kToolTipState.Hidden)

  const
    [tipElement, setTipElement] = useState<HTMLElement | null>(null),
    [areaElement, setAreaElement] = useState<HTMLElement | null>(null)

  const arrowPosition = useMemo(
    () => arrowPositionSrc ?? position,
    [arrowPositionSrc, position]
  )

  const left = useMemo(() => {
    if (!areaElement || !tipElement || !tipElement.clientWidth) {
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
  }, [areaElement, tipElement, position])

  const top = useMemo(() => {
    if (!areaElement || !tipElement || !tipElement.clientHeight) {
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
  }, [areaElement, tipElement, position])

  const arrowLeft = useMemo(() => {
    if (!areaElement) {
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
  }, [areaElement, arrowPosition])

  const arrowTop = useMemo(() => {
    if (!areaElement) {
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
  }, [areaElement, arrowPosition])

  const onAnimationEnd: AnimationEventHandler<HTMLDivElement> = e => {
    if (e.animationName === 'ToolTipLayer-fade-out') {
      setState(kToolTipState.Hidden)
    }
  }

  const onMouseEnter = () => {
    setState(kToolTipState.Shown)
  }

  const onMouseLeave = () => {
    setState(kToolTipState.FadingOut)
  }

  const renderedToolTipElement = useMemo(() => (
    <div
      className={classNames(
        'ToolTipLayer',
        { 'fade-out': state === kToolTipState.FadingOut }
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
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width
        }}
        ref={node => setTipElement(node)}
      >{children}</div>
    </div>
  ), [state, arrowPosition, arrowLeft, arrowTop, left, top, width, children])

  return createElement(
    'div',
    {
      className: classNames('ToolTip', className),
      ref: node => setAreaElement(node),
      onMouseEnter,
      onMouseLeave,
      style: {
        left: areaLeft,
        top: areaTop,
        right: areaRight,
        bottom: areaBottom
      }
    },
    (state !== kToolTipState.Hidden && children)
      ? createPortal(renderedToolTipElement, document.body, `ToolTip-${tipID}`)
      : null
  )
}
