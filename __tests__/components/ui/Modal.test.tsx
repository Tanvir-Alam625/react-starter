import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal'

describe('Modal Components', () => {
  describe('Modal', () => {
    it('renders modal when open', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <div data-testid="modal-content">Modal content</div>
        </Modal>
      )
      
      expect(screen.getByTestId('modal-content')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('does not render modal when closed', () => {
      render(
        <Modal open={false} onClose={vi.fn()}>
          <div data-testid="modal-content">Modal content</div>
        </Modal>
      )
      
      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()
      
      render(
        <Modal open={true} onClose={handleClose}>
          <div>Modal content</div>
        </Modal>
      )
      
      const backdrop = screen.getByTestId('modal-backdrop')
      await user.click(backdrop)
      
      expect(handleClose).toHaveBeenCalled()
    })

    it('calls onClose when escape key is pressed', () => {
      const handleClose = vi.fn()
      
      render(
        <Modal open={true} onClose={handleClose}>
          <div>Modal content</div>
        </Modal>
      )
      
      fireEvent.keyDown(document, { key: 'Escape' })
      
      expect(handleClose).toHaveBeenCalled()
    })

    it('does not close when modal content is clicked', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()
      
      render(
        <Modal open={true} onClose={handleClose}>
          <div data-testid="modal-content">Modal content</div>
        </Modal>
      )
      
      const content = screen.getByTestId('modal-content')
      await user.click(content)
      
      expect(handleClose).not.toHaveBeenCalled()
    })

    it('traps focus within modal', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <div>
            <button data-testid="first-button">First</button>
            <button data-testid="second-button">Second</button>
          </div>
        </Modal>
      )
      
      const firstButton = screen.getByTestId('first-button')
      const secondButton = screen.getByTestId('second-button')
      
      expect(document.activeElement).toBe(firstButton)
      
      fireEvent.keyDown(secondButton, { key: 'Tab' })
      expect(document.activeElement).toBe(firstButton)
    })

    it('restores focus to trigger element when closed', () => {
      const triggerButton = document.createElement('button')
      triggerButton.textContent = 'Open Modal'
      document.body.appendChild(triggerButton)
      triggerButton.focus()
      
      const { rerender } = render(
        <Modal open={true} onClose={vi.fn()}>
          <div>Modal content</div>
        </Modal>
      )
      
      rerender(
        <Modal open={false} onClose={vi.fn()}>
          <div>Modal content</div>
        </Modal>
      )
      
      expect(document.activeElement).toBe(triggerButton)
      
      document.body.removeChild(triggerButton)
    })

    it('applies custom className', () => {
      render(
        <Modal open={true} onClose={vi.fn()} className="custom-modal">
          <div>Modal content</div>
        </Modal>
      )
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('custom-modal')
    })

    it('prevents body scroll when open', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <div>Modal content</div>
        </Modal>
      )
      
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body scroll when closed', () => {
      const { rerender } = render(
        <Modal open={true} onClose={vi.fn()}>
          <div>Modal content</div>
        </Modal>
      )
      
      expect(document.body.style.overflow).toBe('hidden')
      
      rerender(
        <Modal open={false} onClose={vi.fn()}>
          <div>Modal content</div>
        </Modal>
      )
      
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('ModalHeader', () => {
    it('renders header correctly', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalHeader data-testid="modal-header">
            Header content
          </ModalHeader>
        </Modal>
      )
      
      const header = screen.getByTestId('modal-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('modal-header')
    })

    it('applies custom className', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalHeader className="custom-header" data-testid="header">
            Header
          </ModalHeader>
        </Modal>
      )
      
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('ModalTitle', () => {
    it('renders title correctly', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalHeader>
            <ModalTitle>Modal Title</ModalTitle>
          </ModalHeader>
        </Modal>
      )
      
      const title = screen.getByText('Modal Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('modal-title')
    })

    it('applies custom className', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalHeader>
            <ModalTitle className="custom-title">Title</ModalTitle>
          </ModalHeader>
        </Modal>
      )
      
      const title = screen.getByText('Title')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('ModalBody', () => {
    it('renders body correctly', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalBody data-testid="modal-body">
            Body content
          </ModalBody>
        </Modal>
      )
      
      const body = screen.getByTestId('modal-body')
      expect(body).toBeInTheDocument()
      expect(body).toHaveClass('modal-body')
    })

    it('applies custom className', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalBody className="custom-body" data-testid="body">
            Body
          </ModalBody>
        </Modal>
      )
      
      const body = screen.getByTestId('body')
      expect(body).toHaveClass('custom-body')
    })
  })

  describe('ModalFooter', () => {
    it('renders footer correctly', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalFooter data-testid="modal-footer">
            Footer content
          </ModalFooter>
        </Modal>
      )
      
      const footer = screen.getByTestId('modal-footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('modal-footer')
    })

    it('applies custom className', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalFooter className="custom-footer" data-testid="footer">
            Footer
          </ModalFooter>
        </Modal>
      )
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Modal composition', () => {
    it('renders complete modal structure', () => {
      const handleClose = vi.fn()
      
      render(
        <Modal open={true} onClose={handleClose}>
          <ModalHeader>
            <ModalTitle>Confirmation</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this item?</p>
          </ModalBody>
          <ModalFooter>
            <button onClick={handleClose}>Cancel</button>
            <button>Delete</button>
          </ModalFooter>
        </Modal>
      )
      
      expect(screen.getByText('Confirmation')).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    })

    it('handles complex interactions', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()
      const handleDelete = vi.fn()
      
      render(
        <Modal open={true} onClose={handleClose}>
          <ModalHeader>
            <ModalTitle>Delete Confirmation</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <button onClick={handleClose}>Cancel</button>
            <button onClick={handleDelete}>Confirm Delete</button>
          </ModalFooter>
        </Modal>
      )
      
      const deleteButton = screen.getByRole('button', { name: 'Confirm Delete' })
      await user.click(deleteButton)
      
      expect(handleDelete).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalHeader>
            <ModalTitle>Accessible Modal</ModalTitle>
          </ModalHeader>
          <ModalBody>
            Modal content
          </ModalBody>
        </Modal>
      )
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby')
    })

    it('supports screen readers', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <ModalHeader>
            <ModalTitle id="modal-title">Screen Reader Test</ModalTitle>
          </ModalHeader>
          <ModalBody>
            This modal is accessible to screen readers.
          </ModalBody>
        </Modal>
      )
      
      const modal = screen.getByRole('dialog')
      const title = screen.getByText('Screen Reader Test')
      
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')
      expect(title).toHaveAttribute('id', 'modal-title')
    })
  })
})