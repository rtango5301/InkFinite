'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#050505' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin" />
        <p className="text-[#e5e5e5] text-sm font-medium">Loading canvas...</p>
      </div>
    </div>
  ),
})

export default function EditorWrapper() {
  const [resetKey, setResetKey] = useState(0)
  return (
    <ErrorBoundary onReset={() => setResetKey((k) => k + 1)}>
      <Editor key={resetKey} />
    </ErrorBoundary>
  )
}
