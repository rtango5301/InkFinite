import { useEditor } from 'tldraw'

export function CustomToolbar() {
	const editor = useEditor()

	const createMarkdownCard = () => {
		editor.createShape({
			type: 'markdown-card',
			x: editor.getViewportPageBounds().center.x - 150,
			y: editor.getViewportPageBounds().center.y - 100,
		})
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				const dataUrl = reader.result as string
				editor.putExternalContent({
					type: 'files',
					files: [Object.assign(file, { src: dataUrl })],
					point: editor.getViewportPageBounds().center,
					ignoreParent: false,
				})
			}
			reader.readAsDataURL(file)
		}
        // Reset input
        e.target.value = ''
	}

    const exportAsImage = async () => {
        const shapeIds = Array.from(editor.getCurrentPageShapeIds())
        if (shapeIds.length === 0) return

        const result = await editor.getSvgElement(shapeIds, {
            scale: 1,
            background: true,
        })

        if (!result) return
        const { svg } = result

        const png = await getSvgAsImage(svg)

        if (png) {
            const blob = await new Promise<Blob | null>((resolve) => png.toBlob(resolve))
            if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'infinite-canvas-export.png'
                a.click()
                URL.revokeObjectURL(url)
            }
        }
    }

    const exportAsJSON = () => {
        const snapshot = editor.getSnapshot()
        const json = JSON.stringify(snapshot, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'infinite-canvas-backup.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    // Helper to convert SVG to Image (simplified version of tldraw's internal export helper)
    async function getSvgAsImage(svg: SVGSVGElement): Promise<HTMLCanvasElement | null> {
        const clone = svg.cloneNode(true) as SVGSVGElement
        const width = svg.getAttribute('width')
        const height = svg.getAttribute('height')

        if (!width || !height) {
            console.error('SVG missing dimensions')
            return null
        }

        clone.setAttribute('width', width)
        clone.setAttribute('height', height)

        const svgData = new XMLSerializer().serializeToString(clone)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            console.error('Failed to get canvas context')
            return null
        }

        const img = new Image()

        return new Promise<HTMLCanvasElement | null>((resolve) => {
            const timeout = setTimeout(() => {
                console.error('Image load timeout')
                resolve(null)
            }, 10000) // 10 second timeout

            img.onload = () => {
                clearTimeout(timeout)
                canvas.width = parseFloat(width)
                canvas.height = parseFloat(height)
                ctx.drawImage(img, 0, 0)
                resolve(canvas)
            }

            img.onerror = (e) => {
                clearTimeout(timeout)
                console.error('Failed to load SVG as image:', e)
                resolve(null)
            }

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
        })
    }

	return (
		<div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
			<button
				className="bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#e5e5e5] px-4 py-2 rounded-lg border border-[#333] shadow-lg transition-colors flex items-center gap-2"
				onClick={createMarkdownCard}
			>
				<span className="text-lg">📝</span>
				<span className="text-sm font-medium">New Note</span>
			</button>
            <label className="bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#e5e5e5] px-4 py-2 rounded-lg border border-[#333] shadow-lg transition-colors flex items-center gap-2 cursor-pointer">
                <span className="text-lg">🖼️</span>
                <span className="text-sm font-medium">Image</span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
            </label>
            <button
				className="bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#e5e5e5] px-4 py-2 rounded-lg border border-[#333] shadow-lg transition-colors flex items-center gap-2"
				onClick={exportAsImage}
			>
				<span className="text-lg">📸</span>
				<span className="text-sm font-medium">Export PNG</span>
			</button>
            <button
				className="bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#e5e5e5] px-4 py-2 rounded-lg border border-[#333] shadow-lg transition-colors flex items-center gap-2"
				onClick={exportAsJSON}
			>
				<span className="text-lg">💾</span>
				<span className="text-sm font-medium">Save JSON</span>
			</button>
		</div>
	)
}
