'use client'

import { useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { CustomToolbar } from './CustomToolbar'
import { MarkdownCardUtil } from './MarkdownCardUtil'
import Notification from './Notification'

const PERSISTENCE_KEY = 'infinite-canvas-v1'

// Validate and clean localStorage on mount
function validateLocalStorage(): boolean {
  try {
    const data = localStorage.getItem(`TLDRAW_DOCUMENT_v1${PERSISTENCE_KEY}`)
    if (data) {
      // Try to parse the data to ensure it's valid JSON
      JSON.parse(data)
    }
    return true
  } catch (e) {
    console.warn('Corrupted localStorage detected, clearing...', e)
    // Clear corrupted data
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

// Initialize localStorage validation synchronously before render
// This runs once when the module loads
let localStorageValidated = false
function ensureLocalStorageValid() {
  if (!localStorageValidated && typeof window !== 'undefined') {
    validateLocalStorage()
    localStorageValidated = true
  }
}

export default function Editor() {
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'processing' } | null>(null)

  // Run validation synchronously during first render
  ensureLocalStorageValid()



  return (
    <div className="fixed inset-0">
      <Tldraw
        persistenceKey={PERSISTENCE_KEY}
        shapeUtils={[MarkdownCardUtil]}
        onMount={(editor) => {
          // @ts-expect-error - exposing editor to window for debugging
          window.editor = editor
        }}
      >
        <CustomToolbar />
      </Tldraw>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onComplete={() => setNotification(null)}
        />
      )}
    </div>
  )
}
