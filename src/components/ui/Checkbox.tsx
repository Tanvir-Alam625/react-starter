import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="space-y-1">
        <div className="flex items-start space-x-2">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id={inputId}
              ref={ref}
              className={cn(
                'sr-only peer',
                className
              )}
              aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined}
              {...props}
            />
            <div className="flex h-4 w-4 items-center justify-center rounded border border-input bg-background text-background shadow focus-ring peer-checked:bg-primary peer-checked:text-primary-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              <Check className="h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100" />
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
                <p id={`${inputId}-desc`} className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="form-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }