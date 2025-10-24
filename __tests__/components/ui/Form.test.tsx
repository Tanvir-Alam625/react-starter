import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/Form'

// Create a simple form wrapper for testing
const Form = ({ children, onSubmit, className, ...props }: { 
  children: React.ReactNode, 
  onSubmit?: (e: React.FormEvent) => void,
  className?: string,
  [key: string]: any 
}) => (
  <form onSubmit={onSubmit} className={className} {...props}>
    {children}
  </form>
)

describe('Form Components', () => {
  describe('Form', () => {
    it('renders form correctly', () => {
      render(
        <Form onSubmit={vi.fn()} data-testid="test-form">
          <div>Form content</div>
        </Form>
      )
      
      const form = screen.getByTestId('test-form')
      expect(form).toBeInTheDocument()
      expect(form.tagName).toBe('FORM')
    })

    it('handles form submission', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn(e => e.preventDefault())
      
      render(
        <Form onSubmit={onSubmit}>
          <button type="submit">Submit</button>
        </Form>
      )
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      expect(onSubmit).toHaveBeenCalled()
    })

    it('applies custom className', () => {
      render(
        <Form className="custom-form" data-testid="form">
          <div>Content</div>
        </Form>
      )
      
      const form = screen.getByTestId('form')
      expect(form).toHaveClass('custom-form')
    })

    it('supports form validation attributes', () => {
      render(
        <Form noValidate data-testid="form">
          <div>Content</div>
        </Form>
      )
      
      const form = screen.getByTestId('form')
      expect(form).toHaveAttribute('novalidate')
    })
  })

  describe('FormField', () => {
    it('renders form field correctly', () => {
      render(
        <FormField name="testField" data-testid="form-field">
          <div>Field content</div>
        </FormField>
      )
      
      const field = screen.getByTestId('form-field')
      expect(field).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <FormField name="test" className="custom-field" data-testid="field">
          <div>Content</div>
        </FormField>
      )
      
      const field = screen.getByTestId('field')
      expect(field).toHaveClass('custom-field')
    })

    it('handles field-specific props', () => {
      render(
        <FormField name="email" required data-testid="email-field">
          <input type="email" />
        </FormField>
      )
      
      const field = screen.getByTestId('email-field')
      expect(field).toBeInTheDocument()
    })
  })

  describe('FormItem', () => {
    it('renders form item correctly', () => {
      render(
        <FormItem data-testid="form-item">
          <div>Item content</div>
        </FormItem>
      )
      
      const item = screen.getByTestId('form-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveClass('form-item')
    })

    it('applies custom className', () => {
      render(
        <FormItem className="custom-item" data-testid="item">
          <div>Content</div>
        </FormItem>
      )
      
      const item = screen.getByTestId('item')
      expect(item).toHaveClass('custom-item')
    })
  })

  describe('FormLabel', () => {
    it('renders label correctly', () => {
      render(
        <FormLabel htmlFor="test-input">Test Label</FormLabel>
      )
      
      const label = screen.getByText('Test Label')
      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveAttribute('for', 'test-input')
    })

    it('applies custom className', () => {
      render(
        <FormLabel className="custom-label" data-testid="label">
          Custom Label
        </FormLabel>
      )
      
      const label = screen.getByTestId('label')
      expect(label).toHaveClass('custom-label')
    })

    it('handles required state', () => {
      render(
        <FormLabel required data-testid="required-label">
          Required Field
        </FormLabel>
      )
      
      const label = screen.getByTestId('required-label')
      expect(label).toHaveClass('required')
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('can be disabled', () => {
      render(
        <FormLabel disabled data-testid="disabled-label">
          Disabled Label
        </FormLabel>
      )
      
      const label = screen.getByTestId('disabled-label')
      expect(label).toHaveClass('disabled')
    })
  })

  describe('FormControl', () => {
    it('renders form control correctly', () => {
      render(
        <FormControl data-testid="form-control">
          <input type="text" />
        </FormControl>
      )
      
      const control = screen.getByTestId('form-control')
      expect(control).toBeInTheDocument()
      expect(control).toHaveClass('form-control')
    })

    it('applies custom className', () => {
      render(
        <FormControl className="custom-control" data-testid="control">
          <input type="text" />
        </FormControl>
      )
      
      const control = screen.getByTestId('control')
      expect(control).toHaveClass('custom-control')
    })

    it('wraps input elements properly', () => {
      render(
        <FormControl>
          <input type="email" placeholder="Email" />
        </FormControl>
      )
      
      const input = screen.getByPlaceholderText('Email')
      expect(input).toBeInTheDocument()
      expect(input.parentElement).toHaveClass('form-control')
    })
  })

  describe('FormDescription', () => {
    it('renders description correctly', () => {
      render(
        <FormDescription data-testid="form-description">
          This is a helpful description
        </FormDescription>
      )
      
      const description = screen.getByTestId('form-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('form-description')
      expect(description).toHaveTextContent('This is a helpful description')
    })

    it('applies custom className', () => {
      render(
        <FormDescription className="custom-description" data-testid="description">
          Description text
        </FormDescription>
      )
      
      const description = screen.getByTestId('description')
      expect(description).toHaveClass('custom-description')
    })

    it('has proper accessibility attributes', () => {
      render(
        <FormDescription id="field-description">
          Accessible description
        </FormDescription>
      )
      
      const description = screen.getByText('Accessible description')
      expect(description).toHaveAttribute('id', 'field-description')
    })
  })

  describe('FormMessage', () => {
    it('renders error message correctly', () => {
      render(
        <FormMessage type="error" data-testid="error-message">
          This field is required
        </FormMessage>
      )
      
      const message = screen.getByTestId('error-message')
      expect(message).toBeInTheDocument()
      expect(message).toHaveClass('form-message', 'error')
      expect(message).toHaveTextContent('This field is required')
    })

    it('renders success message correctly', () => {
      render(
        <FormMessage type="success" data-testid="success-message">
          Field is valid
        </FormMessage>
      )
      
      const message = screen.getByTestId('success-message')
      expect(message).toHaveClass('form-message', 'success')
      expect(message).toHaveTextContent('Field is valid')
    })

    it('renders warning message correctly', () => {
      render(
        <FormMessage type="warning" data-testid="warning-message">
          This is a warning
        </FormMessage>
      )
      
      const message = screen.getByTestId('warning-message')
      expect(message).toHaveClass('form-message', 'warning')
    })

    it('applies custom className', () => {
      render(
        <FormMessage className="custom-message" data-testid="message">
          Message text
        </FormMessage>
      )
      
      const message = screen.getByTestId('message')
      expect(message).toHaveClass('custom-message')
    })

    it('has proper accessibility attributes', () => {
      render(
        <FormMessage type="error" role="alert">
          Error message
        </FormMessage>
      )
      
      const message = screen.getByText('Error message')
      expect(message).toHaveAttribute('role', 'alert')
    })
  })

  describe('Form composition', () => {
    it('renders complete form structure', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn(e => e.preventDefault())
      
      render(
        <Form onSubmit={onSubmit}>
          <FormField name="email">
            <FormItem>
              <FormLabel htmlFor="email" required>
                Email Address
              </FormLabel>
              <FormControl>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  aria-describedby="email-description email-error"
                />
              </FormControl>
              <FormDescription id="email-description">
                We'll never share your email
              </FormDescription>
              <FormMessage type="error" id="email-error">
                Please enter a valid email
              </FormMessage>
            </FormItem>
          </FormField>
          <button type="submit">Submit</button>
        </Form>
      )
      
      expect(screen.getByText('Email Address')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument()
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      expect(onSubmit).toHaveBeenCalled()
    })

    it('handles multiple form fields', async () => {
      const user = userEvent.setup()
      render(
        <Form>
          <FormField name="firstName">
            <FormItem>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <FormControl>
                <input id="firstName" type="text" />
              </FormControl>
            </FormItem>
          </FormField>
          
          <FormField name="lastName">
            <FormItem>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <FormControl>
                <input id="lastName" type="text" />
              </FormControl>
            </FormItem>
          </FormField>
          
          <FormField name="newsletter">
            <FormItem>
              <FormControl>
                <input id="newsletter" type="checkbox" />
              </FormControl>
              <FormLabel htmlFor="newsletter">
                Subscribe to newsletter
              </FormLabel>
            </FormItem>
          </FormField>
        </Form>
      )
      
      const firstNameInput = screen.getByLabelText('First Name')
      const lastNameInput = screen.getByLabelText('Last Name')
      const newsletterCheckbox = screen.getByLabelText('Subscribe to newsletter')
      
      await user.type(firstNameInput, 'John')
      await user.type(lastNameInput, 'Doe')
      await user.click(newsletterCheckbox)
      
      expect(firstNameInput).toHaveValue('John')
      expect(lastNameInput).toHaveValue('Doe')
      expect(newsletterCheckbox).toBeChecked()
    })

    it('handles form validation states', () => {
      render(
        <Form>
          <FormField name="validField">
            <FormItem>
              <FormLabel>Valid Field</FormLabel>
              <FormControl>
                <input type="text" value="valid@example.com" readOnly />
              </FormControl>
              <FormMessage type="success">
                Email is valid
              </FormMessage>
            </FormItem>
          </FormField>
          
          <FormField name="invalidField">
            <FormItem>
              <FormLabel>Invalid Field</FormLabel>
              <FormControl>
                <input type="text" value="invalid-email" readOnly />
              </FormControl>
              <FormMessage type="error">
                Please enter a valid email
              </FormMessage>
            </FormItem>
          </FormField>
          
          <FormField name="warningField">
            <FormItem>
              <FormLabel>Warning Field</FormLabel>
              <FormControl>
                <input type="password" value="weak" readOnly />
              </FormControl>
              <FormMessage type="warning">
                Password is weak
              </FormMessage>
            </FormItem>
          </FormField>
        </Form>
      )
      
      expect(screen.getByText('Email is valid')).toBeInTheDocument()
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
      expect(screen.getByText('Password is weak')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper label association', () => {
      render(
        <FormField name="accessibleField">
          <FormItem>
            <FormLabel htmlFor="accessible-input">Accessible Label</FormLabel>
            <FormControl>
              <input id="accessible-input" type="text" />
            </FormControl>
          </FormItem>
        </FormField>
      )
      
      const input = screen.getByRole('textbox', { name: 'Accessible Label' })
      expect(input).toBeInTheDocument()
    })

    it('supports aria-describedby for descriptions and errors', () => {
      render(
        <FormField name="describedField">
          <FormItem>
            <FormLabel htmlFor="described-input">Described Field</FormLabel>
            <FormControl>
              <input 
                id="described-input" 
                type="text"
                aria-describedby="field-description field-error"
              />
            </FormControl>
            <FormDescription id="field-description">
              Field description
            </FormDescription>
            <FormMessage type="error" id="field-error">
              Field error
            </FormMessage>
          </FormItem>
        </FormField>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'field-description field-error')
    })

    it('supports ARIA live regions for dynamic messages', () => {
      render(
        <FormMessage type="error" aria-live="polite" role="alert">
          Live error message
        </FormMessage>
      )
      
      const message = screen.getByText('Live error message')
      expect(message).toHaveAttribute('aria-live', 'polite')
      expect(message).toHaveAttribute('role', 'alert')
    })
  })
})