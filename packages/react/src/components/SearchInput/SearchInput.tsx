/**
 * SearchInput — глобальный компонент поля поиска с иконкой и кнопкой очистки.
 *
 * @param className — применяется к корневому wrapper (.search-input-wrapper).
 *   Используйте для контекстной вёрстки (ширина, отступы), не для переопределения внутренней структуры.
 */

import { InputHTMLAttributes, forwardRef, useId } from 'react'
import './SearchInput.css'

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = '',
      onChange,
      onSearch,
      placeholder = 'Поиск...',
      name = 'search',
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || `search-input-${name}-${generatedId}`

    const handleSearch = () => {
      if (onSearch && value) {
        onSearch(value)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
    }

    const handleClear = () => {
      if (onChange) {
        onChange('')
      }
    }

    return (
      <div className={`search-input-wrapper ${className}`.trim()}>
        <div className="search-input-icon" aria-hidden>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          ref={ref}
          type="text"
          id={inputId}
          name={name}
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {value && value.length > 0 && (
          <button
            type="button"
            className="search-input-clear"
            onClick={handleClear}
            aria-label="Очистить"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
