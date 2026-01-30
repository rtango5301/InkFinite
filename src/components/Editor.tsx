'use client'

import { useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { CustomToolbar } from './CustomToolbar'
import { MarkdownCardUtil } from './MarkdownCardUtil'
import Notification from './Notification'

export default function Editor() {
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'processing' } | null>(null)



	return (
		<div className="fixed inset-0">
			<style dangerouslySetInnerHTML={{
				__html: `
					.tl-theme__dark {
						--color-background: #050505;
						--color-low: #1a1a1a;
						--color-hint: #2a2a2a;
						--color-overlay: rgba(5, 5, 5, 0.8);
						--color-primary: #D4AF37;
						--color-primary-highlight: #D4AF37;
						--color-selection-stroke: #00F3FF;
						--color-selection-fill: rgba(0, 243, 255, 0.1);
					}
					.tl-container {
						background-color: var(--color-background);
					}
					/* Custom Glow Effects */
					.tl-shape-indicator {
						filter: drop-shadow(0 0 5px var(--color-neon-blue));
					}
                    .tl-watermark {
                        display: none !important;
                    }
				`
			}} />
			<Tldraw
                persistenceKey="infinite-canvas-v1"
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
