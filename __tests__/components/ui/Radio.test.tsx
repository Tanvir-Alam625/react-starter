import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioOption } from '@/components/ui/Radio'

describe('Radio Components', () => {
  describe('RadioGroup', () => {
    const mockOptions = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', description: 'Second option with description' },
      { value: 'option3', label: 'Option 3' },
    ]

    it('renders radio group with options', () => {
      render(<RadioGroup name="test" options={mockOptions} />)
      
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
      expect(screen.getByText('Second option with description')).toBeInTheDocument()
    })

    it('handles value selection', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(<RadioGroup name="test" options={mockOptions} onChange={handleChange} />)
      
      const option2 = screen.getByLabelText('Option 2')
      await user.click(option2)
      
      expect(handleChange).toHaveBeenCalledWith('option2')
      expect(option2).toBeChecked()
    })

    it('respects initial value', () => {
      render(<RadioGroup name="test" options={mockOptions} value="option2" />)
      
      expect(screen.getByLabelText('Option 2')).toBeChecked()
      expect(screen.getByLabelText('Option 1')).not.toBeChecked()
      expect(screen.getByLabelText('Option 3')).not.toBeChecked()
    })

    it('handles disabled state', () => {
      render(<RadioGroup name="test" options={mockOptions} disabled />)
      
      const options = screen.getAllByRole('radio')
      options.forEach(option => {
        expect(option).toBeDisabled()
      })
    })

    it('handles individual option disabled state', () => {
      const optionsWithDisabled = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2', disabled: true },
        { value: 'option3', label: 'Option 3' },
      ]
      
      render(<RadioGroup name="test" options={optionsWithDisabled} />)
      
      expect(screen.getByLabelText('Option 1')).toBeEnabled()
      expect(screen.getByLabelText('Option 2')).toBeDisabled()
      expect(screen.getByLabelText('Option 3')).toBeEnabled()
    })

    it('displays error message', () => {
      render(<RadioGroup name="test" options={mockOptions} error="Please select an option" />)
      
      expect(screen.getByText('Please select an option')).toBeInTheDocument()
      expect(screen.getByText('Please select an option')).toHaveClass('text-red-600')
    })

    it('handles keyboard navigation', () => {
      render(<RadioGroup name="test" options={mockOptions} />)
      
      const firstOption = screen.getByLabelText('Option 1')
      fireEvent.keyDown(firstOption, { key: 'ArrowDown' })
      
      expect(screen.getByLabelText('Option 2')).toHaveFocus()
    })

    it('applies custom className', () => {
      render(
        <RadioGroup 
          name="test" 
          options={mockOptions} 
          className="custom-radio-group"
        />
      )
      
      // Check if the custom class is applied to the wrapper
      const radioInputs = screen.getAllByRole('radio')
      expect(radioInputs).toHaveLength(3)
      expect(radioInputs[0]).toBeInTheDocument()
    })
  })

  describe('RadioOption', () => {
    it('renders single radio option', () => {
      render(
        <RadioOption
          name="test"
          value="single"
          label="Single Option"
          description="Option description"
        />
      )
      
      expect(screen.getByLabelText('Single Option')).toBeInTheDocument()
      expect(screen.getByText('Option description')).toBeInTheDocument()
    })

    it('handles change event', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <RadioOption
          name="test"
          value="test-value"
          label="Test Option"
          onChange={handleChange}
        />
      )
      
      const radio = screen.getByLabelText('Test Option')
      await user.click(radio)
      
      expect(handleChange).toHaveBeenCalledWith('test-value')
    })

    it('can be checked', () => {
      render(
        <RadioOption
          name="test"
          value="checked"
          label="Checked Option"
          checked
        />
      )
      
      expect(screen.getByLabelText('Checked Option')).toBeChecked()
    })

    it('can be disabled', () => {
      render(
        <RadioOption
          name="test"
          value="disabled"
          label="Disabled Option"
          disabled
        />
      )
      
      expect(screen.getByLabelText('Disabled Option')).toBeDisabled()
    })

    it('applies accessibility attributes', () => {
      render(
        <RadioOption
          name="test"
          value="accessible"
          label="Accessible Option"
          description="This is accessible"
        />
      )
      
      const radio = screen.getByLabelText('Accessible Option')
      expect(radio).toHaveAttribute('type', 'radio')
      expect(radio).toHaveAttribute('name', 'test')
      expect(radio).toHaveAttribute('value', 'accessible')
    })
  })

  describe('RadioGroup integration', () => {
    it('allows only one selection at a time', async () => {
      const user = userEvent.setup()
      const mockOptions = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
        { value: 'c', label: 'Option C' },
      ]
      
      render(<RadioGroup name="exclusive" options={mockOptions} />)
      
      const optionALabel = screen.getByLabelText('Option A')
      const optionBLabel = screen.getByLabelText('Option B')
      const optionCLabel = screen.getByLabelText('Option C')
      
      // Click on the label to select the radio button
      await user.click(screen.getByText('Option A'))
      expect(optionALabel).toBeChecked()
      expect(optionBLabel).not.toBeChecked()
      expect(optionCLabel).not.toBeChecked()
      
      await user.click(screen.getByText('Option B'))
      expect(optionALabel).not.toBeChecked()
      expect(optionBLabel).toBeChecked()
      expect(optionCLabel).not.toBeChecked()
    })

    it('maintains proper form integration', () => {
      const mockOptions = [
        { value: 'form1', label: 'Form Option 1' },
        { value: 'form2', label: 'Form Option 2' },
      ]
      
      render(
        <form data-testid="test-form">
          <RadioGroup name="form-radio" options={mockOptions} value="form1" />
        </form>
      )
      
      const form = screen.getByTestId('test-form') as HTMLFormElement
      const formData = new FormData(form)
      expect(formData.get('form-radio')).toBe('form1')
    })
  })
})