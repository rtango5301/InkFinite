'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Canvas error:', error, errorInfo)
  }

  handleReset = () => {
    // Clear potentially corrupted localStorage
    try {
      localStorage.removeItem('TLDRAW_DOCUMENT_v1')
      localStorage.removeItem('infinite-canvas-v1')
      // Clear any other tldraw-related keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('tldraw') || key.startsWith('TLDRAW')) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }

    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: '#050505' }}
        >
          <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-xl font-semibold text-[#e5e5e5]">
              Canvas failed to load
            </h2>
            <p className="text-sm text-[#999]">
              Something went wrong while initializing the canvas. This might be
              due to corrupted saved data.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8962f] text-[#050505] font-medium rounded-lg transition-colors"
            >
              Clear Data & Reload
            </button>
            {this.state.error && (
              <details className="text-left w-full">
                <summary className="text-xs text-[#666] cursor-pointer">
                  Error details
                </summary>
                <pre className="mt-2 p-2 bg-[#1a1a1a] rounded text-xs text-[#ff6b6b] overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
