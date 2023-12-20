import { Component, ErrorInfo, ReactNode } from 'react'

import { classNames } from '../../utils'

import './ErrorBoundary.scss'

export type ErrorBoundaryProps = {
  children?: ReactNode
  className?: string
  name: string
}

type ErrorBoundaryError = {
  error: Error
  componentStack?: string
}

export type ErrorBoundaryState = {
  err: ErrorBoundaryError | null
  copied: boolean
}

export class ErrorBoundary extends
  Component<ErrorBoundaryProps, ErrorBoundaryState> {

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { err: null, copied: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { err: { error } }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Error boundary:', typeof error)
    console.error(error)
    console.error(errorInfo)
  }

  #copyToClipboard(message: string) {
    navigator.clipboard.writeText(message)

    this.setState({ copied: true })

    setTimeout(() => this.setState({ copied: false }), 5000)
  }

  #getMessage({ error, componentStack }: ErrorBoundaryError) {
    let message = ''

    if (error instanceof Error) {
      message += error.name + '\n\n' + error.message + '\n\n' + error.stack
    } else if (typeof error === 'object') {
      message += JSON.stringify(error, null, 2)
    } else {
      message += String(error)
    }

    if (componentStack) {
      message += `\n\nComponent stack: ${componentStack}`
    }

    return message
  }

  render() {
    if (!this.state || !this.state.err) {
      return this.props.children
    }

    const message = this.#getMessage(this.state.err)

    return (
      <div className={classNames('ErrorBoundary', this.props.className)}>
        <h1 className="title">Something went wrong 😿</h1>

        <div className="message-cont box">
          <pre>{message}</pre>

          <button
            className="copy"
            disabled={this.state.copied}
            onClick={() => this.#copyToClipboard(message)}
          >
            {this.state.copied ? 'Copied to clipboard' : 'Copy to clipboard'}
          </button>
        </div>
      </div>
    )
  }
}
