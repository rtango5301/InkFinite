'use client'

import { useEffect, useState } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'processing'
  onComplete?: () => void
}

export default function Notification({ message, type, onComplete }: NotificationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onComplete) onComplete()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!visible) return null

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[2002] flex items-center gap-3 px-6 py-3 rounded-full bg-black/80 border border-[var(--color-neon-blue)] backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-fade-in-down">
      {type === 'processing' ? (
        <div className="w-4 h-4 border-2 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin" />
      ) : (
        <div className="text-[var(--color-neon-blue)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      )}
      <span className="text-sm font-medium tracking-wide text-white">{message}</span>
    </div>
  )
}
