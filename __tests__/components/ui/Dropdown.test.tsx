import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@/components/ui/Dropdown'

describe('Dropdown Components', () => {
  describe('Dropdown', () => {
    it('renders dropdown correctly', () => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item 1</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument()
    })

    it('opens dropdown on trigger click', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Open Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Menu Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Open Menu' })
      await user.click(trigger)
      
      expect(screen.getByText('Menu Item')).toBeInTheDocument()
    })

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <Dropdown>
            <DropdownTrigger>
              <button>Trigger</button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem>Item</DropdownItem>
            </DropdownContent>
          </Dropdown>
          <div data-testid="outside">Outside element</div>
        </div>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      expect(screen.getByText('Item')).toBeInTheDocument()
      
      const outside = screen.getByTestId('outside')
      await user.click(outside)
      
      expect(screen.queryByText('Item')).not.toBeInTheDocument()
    })

    it('closes dropdown on escape key', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      expect(screen.getByText('Item')).toBeInTheDocument()
      
      fireEvent.keyDown(document, { key: 'Escape' })
      
      expect(screen.queryByText('Item')).not.toBeInTheDocument()
    })

    it('supports controlled state', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      
      const { rerender } = render(
        <Dropdown open={false} onOpenChange={onOpenChange}>
          <DropdownTrigger>
            <button>Controlled Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Controlled Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      expect(screen.queryByText('Controlled Item')).not.toBeInTheDocument()
      
      const trigger = screen.getByRole('button', { name: 'Controlled Trigger' })
      await user.click(trigger)
      
      expect(onOpenChange).toHaveBeenCalledWith(true)
      
      rerender(
        <Dropdown open={true} onOpenChange={onOpenChange}>
          <DropdownTrigger>
            <button>Controlled Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Controlled Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      expect(screen.getByText('Controlled Item')).toBeInTheDocument()
    })
  })

  describe('DropdownTrigger', () => {
    it('renders trigger element', () => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button data-testid="trigger">Custom Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByTestId('trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveTextContent('Custom Trigger')
    })

    it('applies accessibility attributes', () => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button data-testid="accessible-trigger">Accessible</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByTestId('accessible-trigger')
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button data-testid="expandable-trigger">Expandable</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByTestId('expandable-trigger')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      
      await user.click(trigger)
      
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('DropdownContent', () => {
    it('renders content correctly', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent data-testid="dropdown-content">
            <div>Custom Content</div>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      const content = screen.getByTestId('dropdown-content')
      expect(content).toBeInTheDocument()
      expect(screen.getByText('Custom Content')).toBeInTheDocument()
    })

    it('applies custom className', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent className="custom-content" data-testid="content">
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('custom-content')
    })

    it('supports different positioning', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent side="bottom" align="start" data-testid="positioned-content">
            <DropdownItem>Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      const content = screen.getByTestId('positioned-content')
      expect(content).toBeInTheDocument()
    })
  })

  describe('DropdownItem', () => {
    it('renders item correctly', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem data-testid="dropdown-item">Test Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      const item = screen.getByTestId('dropdown-item')
      expect(item).toBeInTheDocument()
      expect(item).toHaveTextContent('Test Item')
    })

    it('handles click events', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={onClick}>Clickable Item</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      const item = screen.getByText('Clickable Item')
      await user.click(item)
      
      expect(onClick).toHaveBeenCalled()
    })

    it('can be disabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem disabled onClick={onClick} data-testid="disabled-item">
              Disabled Item
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      const item = screen.getByTestId('disabled-item')
      expect(item).toHaveAttribute('aria-disabled', 'true')
      
      await user.click(item)
      expect(onClick).not.toHaveBeenCalled()
    })

    it('applies custom className', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem className="custom-item" data-testid="item">
              Custom Item
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      await user.click(trigger)
      
      const item = screen.getByTestId('item')
      expect(item).toHaveClass('custom-item')
    })

    it('supports keyboard navigation', async () => {
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Trigger</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem data-testid="item1">Item 1</DropdownItem>
            <DropdownItem data-testid="item2">Item 2</DropdownItem>
            <DropdownItem data-testid="item3">Item 3</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      fireEvent.click(trigger)
      
      const item1 = screen.getByTestId('item1')
      fireEvent.keyDown(item1, { key: 'ArrowDown' })
      
      const item2 = screen.getByTestId('item2')
      expect(item2).toHaveFocus()
    })
  })

  describe('Dropdown composition', () => {
    it('renders complex dropdown menu', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      const onDelete = vi.fn()
      
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Actions</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={onEdit}>
              <span>Edit</span>
            </DropdownItem>
            <DropdownItem onClick={onDelete} className="text-red-600">
              <span>Delete</span>
            </DropdownItem>
            <DropdownItem disabled>
              <span>Disabled Action</span>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Actions' })
      await user.click(trigger)
      
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
      expect(screen.getByText('Disabled Action')).toBeInTheDocument()
      
      await user.click(screen.getByText('Edit'))
      expect(onEdit).toHaveBeenCalled()
    })

    it('handles nested content', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>
              <div>
                <h4>Title</h4>
                <p>Description</p>
              </div>
            </DropdownItem>
            <DropdownItem>
              <ul>
                <li>Nested Item 1</li>
                <li>Nested Item 2</li>
              </ul>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Menu' })
      await user.click(trigger)
      
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Nested Item 1')).toBeInTheDocument()
      expect(screen.getByText('Nested Item 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Accessible Menu</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem>Item 1</DropdownItem>
            <DropdownItem>Item 2</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Accessible Menu' })
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      
      await user.click(trigger)
      
      const menu = screen.getByRole('menu')
      expect(menu).toBeInTheDocument()
      
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems).toHaveLength(2)
    })

    it('manages focus correctly', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown>
          <DropdownTrigger>
            <button>Focus Test</button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem data-testid="first-item">First</DropdownItem>
            <DropdownItem>Second</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )
      
      const trigger = screen.getByRole('button', { name: 'Focus Test' })
      await user.click(trigger)
      
      const firstItem = screen.getByTestId('first-item')
      expect(firstItem).toHaveFocus()
    })
  })
})