import { type ReactNode } from 'react'
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { cn } from '@/lib/utils'

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  children: ReactNode
  className?: string
}

export interface FormItemProps {
  children: ReactNode
  className?: string
}

export interface FormLabelProps {
  children: ReactNode
  className?: string
  required?: boolean
}

export interface FormControlProps {
  children: ReactNode
  className?: string
}

export interface FormDescriptionProps {
  children: ReactNode
  className?: string
}

export interface FormMessageProps {
  className?: string
}

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  children,
  className,
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <div className={cn('space-y-2', className)} data-field={name}>
      {children}
    </div>
  )
}

const FormItem = ({ children, className }: FormItemProps) => {
  return <div className={cn('space-y-2', className)}>{children}</div>
}

const FormLabel = ({ children, className, required }: FormLabelProps) => {
  return (
    <label className={cn('form-label', className)}>
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  )
}

const FormControl = ({ children, className }: FormControlProps) => {
  return <div className={cn(className)}>{children}</div>
}

const FormDescription = ({ children, className }: FormDescriptionProps) => {
  return <p className={cn('form-description', className)}>{children}</p>
}

const FormMessage = ({ className }: FormMessageProps) => {
  const { formState } = useFormContext()
  const fieldName = 'name' // This would be dynamically set in real implementation
  const error = formState.errors[fieldName]

  if (!error) return null

  return (
    <p className={cn('form-error', className)}>
      {error.message as string}
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
    <div
      className={cn(
        'rounded-md border p-3 text-sm',
        statusClasses[status],
        className
      )}
    >
      {message}
    </div>
  )
}

export {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormStatus,
}