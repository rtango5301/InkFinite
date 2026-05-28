'use client'

import { useCallback, useEffect, useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { CustomToolbar } from './CustomToolbar'
import { MarkdownCardUtil } from './MarkdownCardUtil'
import Notification from './Notification'

const PERSISTENCE_KEY = 'infinite-canvas-v1'

function validateLocalStorage(): boolean {
  try {
    const data = localStorage.getItem(`TLDRAW_DOCUMENT_v1${PERSISTENCE_KEY}`)
    if (data) {
      JSON.parse(data)
    }
    return true
  } catch (e) {
    console.warn('Corrupted localStorage detected, clearing...', e)
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.includes(PERSISTENCE_KEY) || key.startsWith('TLDRAW')) {
          localStorage.removeItem(key)
        }
      })
    } catch (clearError) {
      console.error('Failed to clear localStorage:', clearError)
    }
    return false
  }
}

export default function Editor() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'processing' } | null>(null)

  useEffect(() => {
    validateLocalStorage()
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    return () => {
      delete (window as Window & { editor?: unknown }).editor
    }
  }, [])

  const handleNotificationComplete = useCallback(() => setNotification(null), [])

  return (
    <div className="fixed inset-0">
      <Tldraw
        persistenceKey={PERSISTENCE_KEY}
        shapeUtils={[MarkdownCardUtil]}
        onMount={(editor) => {
          if (process.env.NODE_ENV === 'development') {
            (window as Window & { editor?: unknown }).editor = editor
          }
        }}
      >
        <CustomToolbar onNotify={setNotification} />
      </Tldraw>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onComplete={handleNotificationComplete}
        />
      )}
    </div>
  )
}
