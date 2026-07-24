import { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps<TFieldValues = unknown, TName extends string = string>
  extends HTMLAttributes<HTMLDivElement> {
  name: TName
  children: ReactNode
  className?: string
}

export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export interface FormLabelProps extends HTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  className?: string
  required?: boolean
  disabled?: boolean
}

export interface FormControlProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
  className?: string
}

export interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  type?: 'success' | 'error' | 'warning' | 'loading'
  className?: string
  children: ReactNode
}

const FormField = <TFieldValues = unknown, TName extends string = string>({
  name,
  children,
  className,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <div className={cn('form-field', className)} data-field={name} {...props}>
      {children}
    </div>
  )
}

const FormItem = ({ children, className, ...props }: FormItemProps) => {
  return (
    <div className={cn('form-item', className)} {...props}>
      {children}
    </div>
  )
}

const FormLabel = ({ children, className, required, disabled, ...props }: FormLabelProps) => {
  return (
    <label
      className={cn('form-label', className, required && 'required', disabled && 'disabled')}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  )
}

const FormControl = ({ children, className, ...props }: FormControlProps) => {
  return (
    <div className={cn('form-control', className)} {...props}>
      {children}
    </div>
  )
}

const FormDescription = ({ children, className, ...props }: FormDescriptionProps) => {
  return (
    <p className={cn('form-description', className)} {...props}>
      {children}
    </p>
  )
}

const FormMessage = ({ type = 'error', className, children, ...props }: FormMessageProps) => {
  return (
    <p className={cn('form-message', type, className)} {...props}>
      {children}
    </p>
  )
}

// Form validation status indicator
export interface FormStatusProps {
  status: 'success' | 'error' | 'warning' | 'loading'
  message?: string
  className?: string
}

const FormStatus = ({ status, message, className }: FormStatusProps) => {
  const statusClasses = {
    success: 'border-success-200 bg-success-50 text-success-800',
    error: 'border-error-200 bg-error-50 text-error-800',
    warning: 'border-warning-200 bg-warning-50 text-warning-800',
    loading: 'border-primary-200 bg-primary-50 text-primary-800',
  }

  if (!message) return null

  return (
    <div className={cn('rounded-md border p-3 text-sm', statusClasses[status], className)}>
      {message}
    </div>
  )
}

export { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormStatus }
