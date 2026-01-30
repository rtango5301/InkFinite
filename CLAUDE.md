# CLAUDE.md - AI Assistant Guidelines for InkFinite

## Project Overview

InkFinite is a modern infinite canvas application for visual note-taking. Users can create markdown notes, add images, and organize ideas spatially on a boundless whiteboard. The app features a dark theme with glassmorphism effects and local persistence.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: React 19
- **Canvas Engine**: tldraw v4
- **Styling**: Tailwind CSS v4
- **Markdown Rendering**: react-markdown
- **Linting**: ESLint 9 with Next.js config

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Main entry point (renders EditorWrapper)
│   ├── layout.tsx            # Root layout with fonts and metadata
│   └── globals.css           # Global styles, CSS variables, animations
├── components/
│   ├── Editor.tsx            # Main tldraw canvas with custom theme
│   ├── EditorWrapper.tsx     # Dynamic import wrapper (SSR disabled)
│   ├── CustomToolbar.tsx     # Floating toolbar with actions
│   ├── MarkdownCardUtil.tsx  # Custom tldraw shape for markdown notes
│   └── Notification.tsx      # Toast notification component
public/                       # Static assets (logos, icons)
.github/workflows/ci.yml      # GitHub Actions CI pipeline
```

## Architecture Patterns

### SSR Handling
The tldraw canvas cannot be server-side rendered. The pattern used is:
- `EditorWrapper.tsx` uses `next/dynamic` with `{ ssr: false }`
- This prevents hydration mismatches and black screen issues

### Custom tldraw Shapes
Custom shapes extend `BaseBoxShapeUtil` from tldraw:
- Define shape type and props using tldraw's type system (`T.number`, `T.string`)
- Implement `getDefaultProps()`, `component()`, and `indicator()` methods
- Register via `shapeUtils` prop on `<Tldraw>`

### State Management
- Canvas state: Managed internally by tldraw with `persistenceKey` for localStorage
- UI state: Local React state (`useState`) for notifications
- Editor access: Global via `window.editor` (set on mount) and `useEditor()` hook

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Code Conventions

### TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017

### Components
- Use `'use client'` directive for client-side components
- Functional components with hooks
- Props interfaces defined inline or above component

### Styling
- Tailwind CSS utility classes for component styling
- CSS variables in `globals.css` for theme colors:
  - `--color-gold`: #D4AF37 (primary accent)
  - `--color-neon-blue`: #00F3FF (selection, highlights)
  - `--color-neon-pink`: #FF00FF (secondary accent)
  - `--background`: #050505 (dark background)
- Inline styles for tldraw theme overrides in `Editor.tsx`

### tldraw Customization
- Custom CSS variables set via `.tl-theme__dark` selector
- Watermark hidden via CSS (`.tl-watermark { display: none }`)

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/components/Editor.tsx:41-50` | Tldraw initialization and configuration |
| `src/components/MarkdownCardUtil.tsx:19-87` | Custom markdown note shape implementation |
| `src/components/CustomToolbar.tsx:6-12` | Creating new markdown cards |
| `src/components/CustomToolbar.tsx:33-59` | Export to PNG functionality |
| `src/app/globals.css:1-17` | Theme CSS variables |

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Triggers on push/PR to `main`
2. Uses Node.js 20.x
3. Runs `npm ci` for clean install
4. Executes lint checks (`npm run lint`)
5. Builds project (`npm run build`)

Vercel handles deployment with automatic preview URLs for PRs.

## Important Notes for AI Assistants

### Do's
- Always use the `@/*` path alias for imports from `src/`
- Wrap client-only components (using browser APIs) with `'use client'`
- Use dynamic imports with `{ ssr: false }` for tldraw components
- Follow the existing dark theme color palette
- Test changes with `npm run lint` and `npm run build`

### Don'ts
- Don't add server-side rendering to tldraw components
- Don't modify tldraw's internal state directly; use the editor API
- Don't add environment variables without documenting them
- Don't remove the `persistenceKey` (breaks local storage persistence)

### Common Tasks

**Adding a new custom shape:**
1. Create a new file in `src/components/` extending `BaseBoxShapeUtil`
2. Define the shape type, props, and required methods
3. Register in `Editor.tsx` via the `shapeUtils` array

**Adding a new toolbar action:**
1. Add handler function in `CustomToolbar.tsx`
2. Add button with consistent styling (see existing buttons)
3. Use `editor` from `useEditor()` hook to interact with canvas

**Modifying theme colors:**
1. Update CSS variables in `src/app/globals.css`
2. For tldraw-specific colors, update the inline styles in `Editor.tsx`
