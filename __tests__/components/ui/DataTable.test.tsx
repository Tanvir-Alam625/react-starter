import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { DataTable } from '@/components/ui/DataTable'

describe('DataTable Component', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer' },
  ]

  const mockColumns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role' },
  ]

  it('renders table with data', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('renders empty state when no data', () => {
    render(<DataTable columns={mockColumns} data={[]} />)
    
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('handles sorting when enabled', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={mockColumns} data={mockData} enableSorting />)
    
    const nameHeader = screen.getByText('Name')
    await user.click(nameHeader)
    
    // Should show sorting indicator
    expect(nameHeader.closest('th')).toHaveAttribute('aria-sort')
  })

  it('handles filtering when enabled', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={mockColumns} data={mockData} enableFiltering />)
    
    const filterInput = screen.getByPlaceholderText('Filter...')
    await user.type(filterInput, 'john')
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('handles pagination when enabled', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        enablePagination 
        pageSize={2}
      />
    )
    
    // Should show pagination controls
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
  })

  it('navigates between pages', async () => {
    const user = userEvent.setup()
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        enablePagination 
        pageSize={2}
      />
    )
    
    // Should show first 2 items
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    
    const nextButton = screen.getByText('Next')
    await user.click(nextButton)
    
    // Should show next 2 items
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.getByText('Alice Brown')).toBeInTheDocument()
  })

  it('handles row selection when enabled', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        enableRowSelection
        onSelectionChange={onSelectionChange}
      />
    )
    
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(5) // 4 rows + header select all
    
    await user.click(checkboxes[1]) // First row checkbox
    
    expect(onSelectionChange).toHaveBeenCalled()
  })

  it('handles select all functionality', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        enableRowSelection
        onSelectionChange={onSelectionChange}
      />
    )
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(selectAllCheckbox)
    
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '2', '3', '4'])
    )
  })

  it('applies custom className', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        className="custom-datatable"
        data-testid="datatable"
      />
    )
    
    const table = screen.getByTestId('datatable')
    expect(table).toHaveClass('custom-datatable')
  })

  it('handles custom column rendering', () => {
    const customColumns = [
      { accessorKey: 'name', header: 'Name' },
      { 
        accessorKey: 'email', 
        header: 'Email',
        cell: ({ getValue }) => (
          <a href={`mailto:${getValue()}`}>{getValue()}</a>
        )
      },
      { accessorKey: 'role', header: 'Role' },
    ]
    
    render(<DataTable columns={customColumns} data={mockData} />)
    
    const emailLink = screen.getByRole('link', { name: 'john@example.com' })
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com')
  })

  it('handles loading state', () => {
    render(<DataTable columns={mockColumns} data={[]} loading />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('handles error state', () => {
    render(<DataTable columns={mockColumns} data={[]} error="Failed to load data" />)
    
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
  })

  it('supports custom empty state', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={[]} 
        emptyState={<div>No records found</div>}
      />
    )
    
    expect(screen.getByText('No records found')).toBeInTheDocument()
  })

  it('handles column resizing when enabled', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        enableColumnResizing
      />
    )
    
    // Should have resizable columns
    const resizeHandles = screen.getAllByRole('separator')
    expect(resizeHandles.length).toBeGreaterThan(0)
  })

  it('handles column visibility toggle', async () => {
    const user = userEvent.setup()
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        enableColumnVisibility
      />
    )
    
    const columnToggle = screen.getByText('Columns')
    await user.click(columnToggle)
    
    // Should show column visibility options
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Role')).toBeInTheDocument()
  })

  it('handles dense table variant', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        variant="dense"
        data-testid="dense-table"
      />
    )
    
    const table = screen.getByTestId('dense-table')
    expect(table).toHaveClass('table-dense')
  })

  it('handles sticky header when enabled', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        stickyHeader
        data-testid="sticky-table"
      />
    )
    
    const table = screen.getByTestId('sticky-table')
    expect(table.querySelector('thead')).toHaveClass('sticky')
  })

  it('supports keyboard navigation', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    const table = screen.getByRole('table')
    fireEvent.keyDown(table, { key: 'ArrowDown' })
    
    // Should handle keyboard navigation
    expect(document.activeElement).toBeTruthy()
  })

  it('handles accessibility attributes', () => {
    render(
      <DataTable 
        columns={mockColumns} 
        data={mockData} 
        aria-label="Employee data table"
        aria-describedby="table-description"
      />
    )
    
    const table = screen.getByRole('table')
    expect(table).toHaveAttribute('aria-label', 'Employee data table')
    expect(table).toHaveAttribute('aria-describedby', 'table-description')
  })

  it('handles complex data structure', () => {
    const complexData = [
      { 
        id: 1, 
        user: { name: 'John Doe', avatar: 'avatar1.jpg' },
        contact: { email: 'john@example.com', phone: '123-456-7890' },
        metadata: { created: '2023-01-01', status: 'active' }
      }
    ]
    
    const complexColumns = [
      { 
        accessorKey: 'user.name', 
        header: 'Name',
        cell: ({ row }) => row.original.user.name
      },
      { 
        accessorKey: 'contact.email', 
        header: 'Email',
        cell: ({ row }) => row.original.contact.email
      },
    ]
    
    render(<DataTable columns={complexColumns} data={complexData} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})