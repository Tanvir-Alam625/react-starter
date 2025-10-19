import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { RadioGroup } from '@/components/ui/Radio'
import { Select, type SelectOption } from '@/components/ui/Select'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Dropdown, DropdownTrigger } from '@/components/ui/Dropdown'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { DataTable } from '@/components/ui/DataTable'
import { FormStatus } from '@/components/ui/Form'
import { useTheme } from '@/components/ThemeProvider'
import { Settings, ChevronDown } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

interface SampleData {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  role: string
}

const sampleData: SampleData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'pending', role: 'User' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'active', role: 'Moderator' },
]

const columns: ColumnDef<SampleData>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { 
    accessorKey: 'status', 
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string
      const statusClasses = {
        active: 'status-success',
        inactive: 'status-error', 
        pending: 'status-warning'
      }
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
          {status}
        </span>
      )
    }
  },
  { accessorKey: 'role', header: 'Role' },
]

const selectOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', isDisabled: true },
]

const radioOptions = [
  { value: 'small', label: 'Small', description: 'Perfect for individuals' },
  { value: 'medium', label: 'Medium', description: 'Great for small teams' },
  { value: 'large', label: 'Large', description: 'Best for large organizations' },
]

export const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRadio, setSelectedRadio] = useState('medium')
  const [isLoading, setIsLoading] = useState(false)
  const [formStatus, setFormStatus] = useState<'success' | 'error' | 'warning' | null>(null)
  const { theme, setTheme } = useTheme()

  const handleSubmit = async () => {
    setIsLoading(true)
    setFormStatus(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setFormStatus('success')
    setTimeout(() => setFormStatus(null), 3000)
  }

  const dropdownItems = [
    { key: 'profile', label: 'Profile', onClick: () => console.log('Profile clicked') },
    { key: 'settings', label: 'Settings', onClick: () => console.log('Settings clicked') },
    { key: 'separator1', label: '', separator: true },
    { key: 'logout', label: 'Logout', onClick: () => console.log('Logout clicked') },
  ]

  const themeItems = [
    { key: 'light', label: 'Light', onClick: () => setTheme('light') },
    { key: 'dark', label: 'Dark', onClick: () => setTheme('dark') },
    { key: 'system', label: 'System', onClick: () => setTheme('system') },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Enhanced React Starter
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
          A comprehensive React boilerplate with TypeScript, Tailwind CSS, enhanced UI components, 
          accessibility features, testing setup, and professional development tools.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            Open Modal Demo
          </Button>
          <Dropdown 
            trigger={
              <Button variant="outline" size="lg">
                Theme: {theme} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            }
            items={themeItems}
          />
        </div>
      </div>

      {/* Form Status Demo */}
      {formStatus && (
        <FormStatus 
          status={formStatus} 
          message={
            formStatus === 'success' 
              ? 'Form submitted successfully!' 
              : formStatus === 'error'
              ? 'There was an error submitting the form.'
              : 'Please check your input.'
          }
        />
      )}

      {/* Enhanced Components Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>
              Enhanced form controls with validation and accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Input 
                placeholder="Enter your name" 
                helperText="This field is required"
              />
              <Input 
                type="email" 
                placeholder="Enter your email" 
                error="Please enter a valid email address"
              />
              
              <Select 
                options={selectOptions}
                placeholder="Select an option..."
                helperText="Choose from the available options"
              />

              <Checkbox 
                label="I agree to the terms and conditions"
                description="By checking this, you accept our terms"
              />

              <div>
                <h4 className="font-medium mb-3">Plan Size</h4>
                <RadioGroup
                  name="plan"
                  options={radioOptions}
                  value={selectedRadio}
                  onChange={setSelectedRadio}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  loading={isLoading}
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  {isLoading ? 'Submitting...' : 'Submit Form'}
                </Button>
                <Button variant="outline" className="flex-1">
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardDescription>
              Various button styles and states with loading support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
              </div>

              <div className="flex gap-2">
                <Button size="icon" aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Dropdown Example</h4>
              <Dropdown 
                trigger={<DropdownTrigger>Account Menu</DropdownTrigger>}
                items={dropdownItems}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>
            Advanced data table with sorting, filtering, and pagination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns}
            data={sampleData}
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      {/* Basic Table Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Table</CardTitle>
          <CardDescription>
            Simple table component for basic data display
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>TypeScript Support</TableCell>
                <TableCell><span className="status-success px-2 py-1 rounded text-xs">Active</span></TableCell>
                <TableCell>Core</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tailwind CSS</TableCell>
                <TableCell><span className="status-success px-2 py-1 rounded text-xs">Active</span></TableCell>
                <TableCell>Styling</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Testing Setup</TableCell>
                <TableCell><span className="status-success px-2 py-1 rounded text-xs">Active</span></TableCell>
                <TableCell>Development</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Accessibility</TableCell>
                <TableCell><span className="status-success px-2 py-1 rounded text-xs">Active</span></TableCell>
                <TableCell>Quality</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Demo */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <ModalHeader>
          <ModalTitle>Component Demo Modal</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="text-muted-foreground mb-4">
            This modal demonstrates the enhanced modal component with proper accessibility,
            keyboard navigation, and backdrop click handling.
          </p>
          <div className="space-y-4">
            <Input placeholder="Try typing here..." />
            <Checkbox label="Modal checkbox example" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Small Action</Button>
              <Button size="sm">Primary Action</Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}