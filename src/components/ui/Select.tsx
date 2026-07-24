import { forwardRef, useRef } from 'react'
import ReactSelect, { components, type Props as ReactSelectProps } from 'react-select'
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
  disabled?: boolean
}

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '36px',
    border:
      state.hasValue || state.selectProps.inputValue
        ? '2px solid hsl(var(--primary))'
        : '1px solid hsl(var(--border))',
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
    color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
    '&:hover': {
      backgroundColor: state.isSelected ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
    },
  }),
}

const ClearIndicator = (props: any) => (
  <components.ClearIndicator
    {...props}
    innerProps={{ ...props.innerProps, 'aria-label': 'Clear' }}
  />
)

const OptionWrapper = (props: any) => {
  const { innerProps, data, selectProps } = props
  const originalOnMouseDown = innerProps?.onMouseDown

  const handleMouseDown = (e: any) => {
    try {
      originalOnMouseDown?.(e)
    } catch (err) {
      // ignore
    }

    if (selectProps?.isMulti && typeof selectProps.onChange === 'function') {
      const current = selectProps.value
      const prev = Array.isArray(current) ? current : []
      const exists = prev.find((v: any) => v?.value === data?.value)
      const newValue = exists ? prev : [...prev, data]
      try {
        selectProps.onChange(newValue, { action: 'select-option', option: data })
      } catch (e) {
        // ignore
      }
    }
  }

  return (
    <components.Option {...props} innerProps={{ ...innerProps, onMouseDown: handleMouseDown }} />
  )
}

const Select = forwardRef<any, SelectProps>(
  ({ className, error, helperText, disabled, onChange, ...props }, ref) => {
    const dataTestId = (props as any)['data-testid']
    const multiValueRef = useRef<any[] | undefined>(
      Array.isArray((props as any).value) ? (props as any).value : undefined
    )

    const handleChange = (...args: any[]) => {
      const [value, actionMeta] = args
      if (typeof onChange !== 'function') return

      if (props.isMulti) {
         
        console.log(
          'Select.handleChange called with:',
          JSON.stringify(value),
          'actionMeta:',
          JSON.stringify(actionMeta)
        )
        if (Array.isArray(value)) {
          multiValueRef.current = value
          ;(onChange as any)(value)
        } else {
          const prev = Array.isArray(multiValueRef.current) ? multiValueRef.current : []
          const exists = prev.find((v: any) => v?.value === (value as any)?.value)
          const newValue = exists ? prev : [...prev, value]
          multiValueRef.current = newValue
          ;(onChange as any)(newValue)
        }
      } else if (props.isClearable) {
        ;(onChange as any)(value)
      } else {
        onChange(value, actionMeta)
      }
    }

    const selectedLabel =
      props.value && !Array.isArray(props.value) ? (props.value as SelectOption).label : undefined

    return (
      <div
        className={cn('space-y-1', className)}
        {...(dataTestId ? { 'data-testid': dataTestId } : {})}
      >
        {props.name && selectedLabel && !props.isMulti && (
          <input
            type="text"
            value={selectedLabel}
            readOnly
            hidden
            aria-hidden="true"
            name={`${props.name}-display`}
          />
        )}
        <ReactSelect
          ref={ref}
          styles={customStyles}
          classNamePrefix="react-select"
          {...props}
          className={cn('react-select', className)}
          isDisabled={disabled ?? props.isDisabled}
          closeMenuOnSelect={props.isMulti ? false : props.closeMenuOnSelect}
          noOptionsMessage={props.noOptionsMessage ?? (() => 'No options available')}
          components={{ ...(props.components ?? {}), ClearIndicator, Option: OptionWrapper }}
          aria-label={(props as any)['aria-label'] ?? ''}
          onChange={handleChange}
        />
        {error && <p className="form-error text-red-600">{error}</p>}
        {helperText && !error && <p className="form-description text-gray-600">{helperText}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
