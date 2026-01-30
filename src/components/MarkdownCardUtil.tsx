
import ReactMarkdown from 'react-markdown'
import {
    BaseBoxShapeUtil,
    HTMLContainer,
    T,
    TLBaseShape,
} from 'tldraw'

type IMarkdownCardShape = TLBaseShape<
	'markdown-card',
	{
		w: number
		h: number
		text: string
	}
>

export class MarkdownCardUtil extends BaseBoxShapeUtil<IMarkdownCardShape> {
	static override type = 'markdown-card' as const
	static override props = {
		w: T.number,
		h: T.number,
		text: T.string,
	}

	override getDefaultProps(): IMarkdownCardShape['props'] {
		return {
			w: 300,
			h: 200,
			text: '# New Note\nDouble click to edit',
		}
	}

	component(shape: IMarkdownCardShape) {
        const { text } = shape.props
        const isEditing = this.editor.getEditingShapeId() === shape.id

		return (
			<HTMLContainer
				style={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: 8,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
					padding: 16,
					color: '#e5e5e5',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'all',
				}}
			>
                {isEditing ? (
                    <textarea
                        className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm"
                        value={text}
                        onChange={(e) => {
                            this.editor.updateShape({
                                id: shape.id,
                                type: 'markdown-card',
                                props: { text: e.target.value },
                            })
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
						autoFocus
                    />
                ) : (
                    <div className="prose prose-invert prose-sm w-full h-full overflow-y-auto select-text">
                        <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                )}
			</HTMLContainer>
		)
	}

	indicator(shape: IMarkdownCardShape) {
		return (
			<rect
				width={shape.props.w}
				height={shape.props.h}
                rx={8}
                ry={8}
			/>
		)
	}
}
