import { useRef, useState } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide'

import { classNames } from '../../utils'
import { useEventBus } from '../../hooks/use-event-bus'
import { kWindowNames } from '../../config/enums'

import '@splidejs/splide/css/core'
import './FTUE.scss'

import { Link } from '../Link/Link'

export type FTUEProps = {
  className?: string
}

export function FTUE({ className }: FTUEProps) {
  const eventBus = useEventBus()

  const sliderRef = useRef<Splide | null>(null)

  const drag = (e: React.MouseEvent) => {
    if (e.button === 0) {
      eventBus.emit('dragWindow', kWindowNames.desktop)
    }
  }

  const close = () => {
    eventBus.emit('closeWindow', kWindowNames.desktop)
  }

  const setSlide = (n: number) => {
    sliderRef.current?.go(n)
  }

  const setFTUESeen = () => {
    eventBus.emit('setFTUESeen')
  }

  return (
    <div className={classNames('FTUE', className)}>
      <button className="close" onClick={close} />

      <div className="drag" onMouseDown={drag} />

      <Splide
        className="slider"
        ref={sliderRef}
        options={{
          arrows: false,
          pagination: true,
          drag: false,
          classes: {
            pagination: 'slider-pagination'
          }
        }}
      >
        <SplideSlide className="slide slide-1">
          <h2>Overwolf Front App</h2>
          <p>
            Now that you have covered the basics with the Sample App, it&apos;s
            time to learn how to implement UX/UI best practices in your app!
          </p>
          <button
            className="next"
            onClick={() => setSlide(1)}
          >Start tour</button>
        </SplideSlide>

        <SplideSlide className="slide slide-2">
          <h2>Informative Tooltips</h2>
          <p>
            Interact with tooltips to learn how the different sections work.
            Become the master of tooltips and knowledge!
          </p>
          <button
            className="next"
            onClick={() => setSlide(2)}
          >Continue</button>
        </SplideSlide>

        <SplideSlide className="slide slide-3">
          <h2>In-game function</h2>
          <p>
            Don&apos;t forget to try the Front App in-game as well.<br />
            Try it with any Overwolf supported game
          </p>
          <p>
            To view the full list click&nbsp;
            <Link url="https://www.overwolf.com/supported-games/">here</Link>
          </p>
          <button className="next next-cta" onClick={setFTUESeen}>
            Get started
          </button>
        </SplideSlide>
      </Splide>

      <button className="skip" onClick={setFTUESeen}>Skip</button>
    </div>
  )
}
