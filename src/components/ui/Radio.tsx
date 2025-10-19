import { forwardRef, type InputHTMLAttributes } from 'react'
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

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="flex items-start space-x-2">
        <div className="relative flex items-center">
          <input
            type="radio"
            id={inputId}
            ref={ref}
            className={cn(
              'sr-only peer',
              className
            )}
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
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Radio.displayName = 'Radio'

const RadioGroup = ({ name, options, value, onChange, className, error, helperText, disabled }: RadioGroupProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            label={option.label}
            description={option.description}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>
      {error && (
        <p className="form-error">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="form-description">
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Radio, RadioGroup }