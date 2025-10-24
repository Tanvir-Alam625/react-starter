import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableHead, 
  TableRow, 
  TableCell,
  TableCaption 
} from '@/components/ui/Table'

describe('Table Components', () => {
  describe('Table', () => {
    it('renders table correctly', () => {
      render(
        <Table data-testid="test-table">
          <TableBody>
            <TableRow>
              <TableCell>Cell content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const table = screen.getByTestId('test-table')
      expect(table).toBeInTheDocument()
      expect(table.tagName).toBe('TABLE')
    })

    it('applies custom className', () => {
      render(
        <Table className="custom-table" data-testid="table">
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const table = screen.getByTestId('table')
      expect(table).toHaveClass('custom-table')
    })
  })

  describe('TableCaption', () => {
    it('renders caption correctly', () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const caption = screen.getByText('Table Caption')
      expect(caption).toBeInTheDocument()
      expect(caption.tagName).toBe('CAPTION')
    })

    it('applies custom className', () => {
      render(
        <Table>
          <TableCaption className="custom-caption">Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const caption = screen.getByText('Caption')
      expect(caption).toHaveClass('custom-caption')
    })
  })

  describe('TableHeader', () => {
    it('renders header correctly', () => {
      render(
        <Table>
          <TableHeader data-testid="table-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      
      const header = screen.getByTestId('table-header')
      expect(header).toBeInTheDocument()
      expect(header.tagName).toBe('THEAD')
    })

    it('applies custom className', () => {
      render(
        <Table>
          <TableHeader className="custom-header" data-testid="header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('TableBody', () => {
    it('renders body correctly', () => {
      render(
        <Table>
          <TableBody data-testid="table-body">
            <TableRow>
              <TableCell>Body content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const body = screen.getByTestId('table-body')
      expect(body).toBeInTheDocument()
      expect(body.tagName).toBe('TBODY')
    })

    it('applies custom className', () => {
      render(
        <Table>
          <TableBody className="custom-body" data-testid="body">
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const body = screen.getByTestId('body')
      expect(body).toHaveClass('custom-body')
    })
  })

  describe('TableFooter', () => {
    it('renders footer correctly', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter data-testid="table-footer">
            <TableRow>
              <TableCell>Footer content</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      const footer = screen.getByTestId('table-footer')
      expect(footer).toBeInTheDocument()
      expect(footer.tagName).toBe('TFOOT')
    })

    it('applies custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter className="custom-footer" data-testid="footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('TableRow', () => {
    it('renders row correctly', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-testid="table-row">
              <TableCell>Row content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = screen.getByTestId('table-row')
      expect(row).toBeInTheDocument()
      expect(row.tagName).toBe('TR')
    })

    it('applies custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="custom-row" data-testid="row">
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = screen.getByTestId('row')
      expect(row).toHaveClass('custom-row')
    })
  })

  describe('TableHead', () => {
    it('renders head cell correctly', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead data-testid="table-head">Header Cell</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      
      const head = screen.getByTestId('table-head')
      expect(head).toBeInTheDocument()
      expect(head.tagName).toBe('TH')
    })

    it('applies custom className', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head" data-testid="head">Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      
      const head = screen.getByTestId('head')
      expect(head).toHaveClass('custom-head')
    })

    it('supports scope attribute', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" data-testid="scoped-head">Column Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      
      const head = screen.getByTestId('scoped-head')
      expect(head).toHaveAttribute('scope', 'col')
    })
  })

  describe('TableCell', () => {
    it('renders cell correctly', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell data-testid="table-cell">Cell content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const cell = screen.getByTestId('table-cell')
      expect(cell).toBeInTheDocument()
      expect(cell.tagName).toBe('TD')
    })

    it('applies custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell" data-testid="cell">Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const cell = screen.getByTestId('cell')
      expect(cell).toHaveClass('custom-cell')
    })

    it('supports colspan and rowspan', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} rowSpan={1} data-testid="spanned-cell">
                Spanned Cell
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const cell = screen.getByTestId('spanned-cell')
      expect(cell).toHaveAttribute('colspan', '2')
      expect(cell).toHaveAttribute('rowspan', '1')
    })
  })

  describe('Table composition', () => {
    it('renders complete table structure', () => {
      render(
        <Table>
          <TableCaption>Employee Information</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>Developer</TableCell>
              <TableCell>Engineering</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>Designer</TableCell>
              <TableCell>Design</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total: 2 employees</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      expect(screen.getByText('Employee Information')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Department')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Developer')).toBeInTheDocument()
      expect(screen.getByText('Designer')).toBeInTheDocument()
      expect(screen.getByText('Engineering')).toBeInTheDocument()
      expect(screen.getByText('Design')).toBeInTheDocument()
      expect(screen.getByText('Total: 2 employees')).toBeInTheDocument()
    })

    it('handles nested content', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <div>
                  <h3>Complex Content</h3>
                  <p>Description</p>
                  <button>Action</button>
                </div>
              </TableCell>
              <TableCell>
                <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      expect(screen.getByText('Complex Content')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper table structure for screen readers', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Column 1</TableHead>
              <TableHead scope="col">Column 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead scope="row">Row Header</TableHead>
              <TableCell>Data Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const columnHeaders = screen.getAllByRole('columnheader')
      const rowHeader = screen.getByRole('rowheader')
      const dataCell = screen.getByRole('cell')
      
      expect(columnHeaders).toHaveLength(2)
      expect(rowHeader).toBeInTheDocument()
      expect(dataCell).toBeInTheDocument()
    })

    it('supports aria-label and aria-describedby', () => {
      render(
        <Table aria-label="Data table" aria-describedby="table-description">
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const table = screen.getByRole('table')
      expect(table).toHaveAttribute('aria-label', 'Data table')
      expect(table).toHaveAttribute('aria-describedby', 'table-description')
    })
  })
})