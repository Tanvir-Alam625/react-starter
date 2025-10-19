import { forwardRef } from 'react'
import ReactSelect, { type Props as ReactSelectProps } from 'react-select'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  isDisabled?: boolean
}

interface SelectProps extends Omit<ReactSelectProps<SelectOption>, 'classNames'> {
  className?: string
  error?: string
  helperText?: string
}

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '36px',
    border: state.hasValue || state.selectProps.inputValue ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
    borderRadius: '6px',
    backgroundColor: 'hsl(var(--background))',
    boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
    '&:hover': {
      borderColor: 'hsl(var(--border))',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 8px',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0',
    color: 'hsl(var(--foreground))',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: 'hsl(var(--muted-foreground))',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'hsl(var(--foreground))',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '6px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'hsl(var(--primary))'
      : state.isFocused
      ? 'hsl(var(--accent))'
      : 'transparent',
    color: state.isSelected
      ? 'hsl(var(--primary-foreground))'
      : 'hsl(var(--foreground))',
    '&:hover': {
      backgroundColor: state.isSelected ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
    },
  }),
}

const Select = forwardRef<any, SelectProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <ReactSelect
          ref={ref}
          styles={customStyles}
          className={cn('react-select', className)}
          classNamePrefix="react-select"
          {...props}
        />
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
)
Select.displayName = 'Select'

export { Select }