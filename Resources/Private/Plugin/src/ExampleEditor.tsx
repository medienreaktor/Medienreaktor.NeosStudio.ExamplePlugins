import { useState } from 'react'
import type { PropertyEditorProps } from '@medienreaktor/neos-studio'

/**
 * A property editor conforms to the shared editor contract (PropertyEditorProps)
 * so the one component serves both the inspector and the node creation dialog.
 *
 * The essentials:
 *  - `value` seeds local state; the host remounts on a subject change to reset.
 *  - call `onCommit` at a natural commit boundary (a discrete pick, blur) - the
 *    inspector persists there. It is required.
 *  - call `onChange` on every keystroke-level change so the creation dialog's
 *    live validation stays current. Optional.
 *
 * This example edits a colour string: click a swatch (a discrete pick →
 * commit) or type a value (change per keystroke, commit on blur). The swatch
 * list comes from `options.colors`, i.e. editorOptions in node type config.
 */
export function ExampleEditor({
  value,
  options,
  onCommit,
  onChange,
  autoFocus,
  invalid,
}: PropertyEditorProps) {
  const [text, setText] = useState(typeof value === 'string' ? value : '')

  const colors = Array.isArray(options.colors)
    ? (options.colors as unknown[]).filter(
        (c): c is string => typeof c === 'string',
      )
    : ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7']

  const pick = (color: string) => {
    setText(color)
    onChange?.(color)
    onCommit(color)
  }

  return (
    <div className="nsx-editor">
      <div className="nsx-swatches">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={
              'nsx-swatch' + (text === color ? ' nsx-swatch--active' : '')
            }
            style={{ backgroundColor: color }}
            title={color}
            aria-label={color}
            aria-pressed={text === color}
            onClick={() => pick(color)}
          />
        ))}
      </div>
      <div className="nsx-editor__row">
        <span
          className="nsx-preview"
          style={{ backgroundColor: text || 'transparent' }}
        />
        <input
          type="text"
          className="nsx-input"
          value={text}
          autoFocus={autoFocus}
          aria-invalid={invalid || undefined}
          placeholder="#rrggbb"
          onChange={(event) => {
            setText(event.target.value)
            onChange?.(event.target.value)
          }}
          onBlur={() => onCommit(text === '' ? null : text)}
        />
      </div>
    </div>
  )
}
