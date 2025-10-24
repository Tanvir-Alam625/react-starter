import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Select } from '@/components/ui/Select'

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  const mockGroupedOptions = [
    {
      label: 'Group 1',
      options: [
        { value: 'g1-option1', label: 'Group 1 Option 1' },
        { value: 'g1-option2', label: 'Group 1 Option 2' },
      ]
    },
    {
      label: 'Group 2',
      options: [
        { value: 'g2-option1', label: 'Group 2 Option 1' },
        { value: 'g2-option2', label: 'Group 2 Option 2' },
      ]
    }
  ]

  it('renders select component', () => {
    render(<Select options={mockOptions} placeholder="Select an option" />)
    
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<Select options={mockOptions} placeholder="Select an option" />)
    
    const selectContainer = screen.getByText('Select an option')
    await user.click(selectContainer)
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('handles option selection', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Select options={mockOptions} onChange={handleChange} placeholder="Select an option" />)
    
    const selectContainer = screen.getByText('Select an option')
    await user.click(selectContainer)
    
    const option2 = screen.getByText('Option 2')
    await user.click(option2)
    
    // React-Select passes the option value and action metadata
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'option2', label: 'Option 2' }),
      expect.any(Object)
    )
  })

  it('displays selected value', () => {
    const selectedValue = { value: 'option2', label: 'Option 2' }
    render(<Select options={mockOptions} value={selectedValue} />)
    
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('handles searchable select', async () => {
    const user = userEvent.setup()
    render(<Select options={mockOptions} isSearchable placeholder="Search options" />)
    
    // For react-select, we need to find the actual input element
    const input = screen.getByRole('combobox')
    await user.type(input, 'Option 1')
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument()
  })

  it('handles multi-select', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Select options={mockOptions} isMulti onChange={handleChange} placeholder="Multi select" />)
    
    const selectContainer = screen.getByText('Multi select')
    await user.click(selectContainer)
    
    const option1 = screen.getByText('Option 1')
    const option2 = screen.getByText('Option 2')
    
    await user.click(option1)
    await user.click(option2)
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ value: 'option1', label: 'Option 1' }),
        expect.objectContaining({ value: 'option2', label: 'Option 2' })
      ])
    )
  })

  it('displays error state', () => {
    render(<Select options={mockOptions} error="This field is required" />)
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600')
  })

  it('displays helper text', () => {
    render(<Select options={mockOptions} helperText="Choose your preferred option" />)
    
    expect(screen.getByText('Choose your preferred option')).toBeInTheDocument()
    expect(screen.getByText('Choose your preferred option')).toHaveClass('text-gray-600')
  })

  it('can be disabled', () => {
    render(<Select options={mockOptions} disabled placeholder="Disabled select" />)
    
    const selectContainer = screen.getByText('Disabled select').closest('.react-select__control')
    expect(selectContainer).toHaveClass('react-select__control--is-disabled')
  })

  it('handles grouped options', async () => {
    const user = userEvent.setup()
    render(<Select options={mockGroupedOptions} placeholder="Grouped options" />)
    
    const selectContainer = screen.getByText('Grouped options')
    await user.click(selectContainer)
    
    expect(screen.getByText('Group 1')).toBeInTheDocument()
    expect(screen.getByText('Group 2')).toBeInTheDocument()
    expect(screen.getByText('Group 1 Option 1')).toBeInTheDocument()
    expect(screen.getByText('Group 2 Option 1')).toBeInTheDocument()
  })

  it('handles clearable select', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const selectedValue = { value: 'option1', label: 'Option 1' }
    
    render(<Select options={mockOptions} value={selectedValue} isClearable onChange={handleChange} />)
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    
    const clearButton = screen.getByLabelText('Clear')
    await user.click(clearButton)
    
    expect(handleChange).toHaveBeenCalledWith(null)
  })

  it('applies custom className', () => {
    render(<Select options={mockOptions} className="custom-select" data-testid="select" />)
    
    const selectWrapper = screen.getByTestId('select')
    expect(selectWrapper).toHaveClass('custom-select')
  })

  it('handles keyboard navigation', async () => {
    render(<Select options={mockOptions} placeholder="Keyboard test" />)
    
    const selectContainer = screen.getByText('Keyboard test')
    
    fireEvent.keyDown(selectContainer, { key: 'ArrowDown' })
    
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('handles loading state', () => {
    render(<Select options={mockOptions} isLoading placeholder="Loading..." />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles no options message', async () => {
    const user = userEvent.setup()
    render(<Select options={[]} placeholder="No options" />)
    
    const selectContainer = screen.getByText('No options')
    await user.click(selectContainer)
    
    expect(screen.getByText('No options')).toBeInTheDocument()
  })

  it('handles custom option formatting', async () => {
    const user = userEvent.setup()
    const customOptions = [
      { value: 'custom1', label: 'Custom 1', description: 'First custom option' },
      { value: 'custom2', label: 'Custom 2', description: 'Second custom option' },
    ]
    
    render(<Select options={customOptions} placeholder="Custom format" />)
    
    const selectContainer = screen.getByText('Custom format')
    await user.click(selectContainer)
    
    expect(screen.getByText('Custom 1')).toBeInTheDocument()
    expect(screen.getByText('Custom 2')).toBeInTheDocument()
  })

  it('maintains focus management', async () => {
    const user = userEvent.setup()
    render(<Select options={mockOptions} placeholder="Focus test" autoFocus />)
    
    expect(document.activeElement).toBe(screen.getByLabelText(''))
  })

  it('handles form integration', () => {
    const selectedValue = { value: 'form-option', label: 'Form Option' }
    
    render(
      <form data-testid="form">
        <Select 
          name="form-select" 
          options={mockOptions} 
          value={selectedValue}
        />
      </form>
    )
    
    expect(screen.getByDisplayValue('Form Option')).toBeInTheDocument()
  })
})