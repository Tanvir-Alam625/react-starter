import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  error?: string
  helperText?: string
  disabled?: boolean
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  description?: string
  onChange?: (value: string) => void
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, onChange, ...props }, ref) => {
    const inputId = id || `radio-${Math.random().toString(36).slice(2, 11)}`

    return (
      <div className="flex items-start space-x-2">
        <div className="relative flex items-center">
          <input
            type="radio"
            id={inputId}
            ref={ref}
            className={cn('sr-only peer', className)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)}
            {...props}
          />
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-input bg-background shadow focus-ring peer-checked:border-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            <div className="h-2 w-2 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100" />
          </div>
        </div>
        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={inputId}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            )}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        )}
      </div>
    )
  }
)
Radio.displayName = 'Radio'

const RadioGroup = ({
  name,
  options,
  value,
  onChange,
  className,
  error,
  helperText,
  disabled,
}: RadioGroupProps) => {
  const [internalValue, setInternalValue] = useState<string>(value ?? '')
  const radioRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const selectedValue = value !== undefined ? value : internalValue

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      const nextIndex = (index + 1) % options.length
      radioRefs.current[nextIndex]?.focus()
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const previousIndex = (index - 1 + options.length) % options.length
      radioRefs.current[previousIndex]?.focus()
    }
  }

  return (
    <div className={cn('space-y-3', className)} role="radiogroup">
      <div className="space-y-2">
        {options.map((option, index) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleChange}
            onKeyDown={(event) => handleKeyDown(event, index)}
            label={option.label}
            description={option.description}
            disabled={disabled || option.disabled}
            ref={(el) => {
              radioRefs.current[index] = el
            }}
          />
        ))}
      </div>
      {error && <p className="form-error text-red-600">{error}</p>}
      {helperText && !error && <p className="form-description text-gray-600">{helperText}</p>}
    </div>
  )
}

export { Radio, Radio as RadioOption, RadioGroup }
