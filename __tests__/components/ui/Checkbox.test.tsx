import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from '@/components/ui/Checkbox'

describe('Checkbox Component', () => {
  it('renders checkbox with label', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
  })

  it('handles checked state', () => {
    const handleChange = vi.fn()
    render(<Checkbox label="Test checkbox" onChange={handleChange} />)
    
    const checkbox = screen.getByLabelText('Test checkbox')
    fireEvent.click(checkbox)
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('shows description when provided', () => {
    render(
      <Checkbox 
        label="Test checkbox" 
        description="This is a description" 
      />
    )
    
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(
      <Checkbox 
        label="Test checkbox" 
        error="This field is required" 
      />
    )
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<Checkbox label="Disabled checkbox" disabled />)
    const checkbox = screen.getByLabelText('Disabled checkbox')
    
    expect(checkbox).toBeDisabled()
  })
})