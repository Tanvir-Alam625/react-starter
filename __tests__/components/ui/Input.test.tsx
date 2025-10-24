import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input Component', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('form-input')
  })

  it('renders with different types', () => {
    const { rerender } = render(<Input type="email" data-testid="email-input" />)
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="password-input" />)
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" data-testid="number-input" />)
    expect(screen.getByTestId('number-input')).toHaveAttribute('type', 'number')
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} placeholder="Test input" />)
    const input = screen.getByPlaceholderText('Test input')

    await user.type(input, 'Hello World')
    
    expect(handleChange).toHaveBeenCalledTimes(11) // One for each character
    expect(input).toHaveValue('Hello World')
  })

  it('displays error state correctly', () => {
    render(<Input error="This field is required" placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    const errorMessage = screen.getByText('This field is required')
    
    expect(input).toHaveClass('border-destructive')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('form-error')
  })

  it('displays helper text', () => {
    render(<Input helperText="Enter your full name" placeholder="Name" />)
    
    const helperText = screen.getByText('Enter your full name')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('form-description')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('form-input')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Test" />)
    
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Input ref={ref} placeholder="Ref test" />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('has proper accessibility attributes', () => {
    render(
      <Input 
        placeholder="Accessible input"
        error="Error message"
        helperText="Helper text"
        aria-label="Test input"
      />
    )
    
    const input = screen.getByPlaceholderText('Accessible input')
    expect(input).toHaveAttribute('aria-label', 'Test input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('focuses on click', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Focus test" />)
    
    const input = screen.getByPlaceholderText('Focus test')
    await user.click(input)
    
    expect(input).toHaveFocus()
  })

  it('handles keyboard events', () => {
    const handleKeyDown = vi.fn()
    render(<Input onKeyDown={handleKeyDown} placeholder="Keyboard test" />)
    
    const input = screen.getByPlaceholderText('Keyboard test')
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(handleKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'Enter',
        code: 'Enter'
      })
    )
  })
})