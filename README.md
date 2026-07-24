# React TypeScript Starter 🚀

A modern, professional React boilerplate built with TypeScript, Vite, Tailwind CSS, and comprehensive UI components. Features advanced form controls, data tables, theming, accessibility, and professional development tools.

## ✨ Features

### Core Technologies

- ⚡ **Vite** - Lightning-fast development and build tooling
- 🎯 **TypeScript** - Type-safe development with strict configuration
- 🎨 **Tailwind CSS** - Utility-first CSS framework with CSS variables
- 🧪 **Testing** - Vitest and React Testing Library with comprehensive test setup
- 📏 **Linting** - ESLint with TypeScript, React, and accessibility plugins
- 🎭 **Formatting** - Prettier with automated pre-commit hooks

### Enhanced UI Components

- 🔘 **Button** - Multiple variants, sizes, loading states, and icons
- 📝 **Input** - Enhanced with validation states and helper text
- ☑️ **Checkbox** - Accessible with labels and descriptions
- 🔘 **Radio** - Radio groups with descriptions and validation
- 📋 **Select** - React-Select integration with custom styling
- 🪟 **Modal** - Accessible modal with backdrop and keyboard handling
- 📊 **DataTable** - Advanced table with sorting, filtering, and pagination
- 📄 **Table** - Basic table components with consistent styling
- 🎯 **Dropdown** - Custom dropdown with flexible positioning
- 🎨 **Card** - Content containers with header, body, and footer

### Advanced Features

- 🌙 **Theme System** - Light/dark/system themes with CSS variables
- 📦 **State Management** - Zustand for lightweight state management
- 🌐 **HTTP Client** - Enhanced Axios with caching and interceptors
- 🔗 **React Query** - Server state management and caching
- 📋 **Form Handling** - React Hook Form with Zod validation
- ♿ **Accessibility** - WCAG compliant with proper ARIA attributes
- 🧪 **Testing** - Comprehensive test setup with organized test directory
- 🔧 **Git Hooks** - Pre-commit linting and formatting with Husky
- 📱 **Responsive** - Mobile-first responsive design patterns

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   │   ├── Button.tsx      # Enhanced button with variants
│   │   ├── Input.tsx       # Input with validation
│   │   ├── Checkbox.tsx    # Accessible checkbox
│   │   ├── Radio.tsx       # Radio group components
│   │   ├── Select.tsx      # React-Select wrapper
│   │   ├── Modal.tsx       # Accessible modal
│   │   ├── Table.tsx       # Basic table components
│   │   ├── DataTable.tsx   # Advanced data table
│   │   ├── Dropdown.tsx    # Custom dropdown
│   │   ├── Card.tsx        # Content containers
│   │   └── Form.tsx        # Form components
│   ├── Layout.tsx      # Layout components
│   └── ThemeProvider.tsx   # Theme context
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── utils.ts        # Common utilities
│   └── api.ts          # Enhanced API client
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── test/               # Test utilities and setup

__tests__/              # Organized test directory
├── components/
│   └── ui/             # Component tests
└── ...                 # Other test files
```

## 🚀 Quick Start

1. **Clone and setup:**

   ```bash
   git clone <your-repo-url>
   cd react-starter
   npm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Script                  | Description                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Start development server          |
| `npm run build`         | Build for production              |
| `npm run preview`       | Preview production build          |
| `npm run test`          | Run tests in watch mode           |
| `npm run test:run`      | Run tests once                    |
| `npm run test:coverage` | Run tests with coverage           |
| `npm run lint`          | Lint and auto-fix code            |
| `npm run lint:check`    | Check linting without fixing      |
| `npm run format`        | Format code with Prettier         |
| `npm run format:check`  | Check code formatting             |
| `npm run type-check`    | Run TypeScript type checking      |
| `npm run validate`      | Run all checks (lint, type, test) |

## 🎨 UI Components Usage

### Enhanced Button

```tsx
import { Button } from '@/components/ui/Button'

// Basic usage
<Button>Click me</Button>

// With variants and loading
<Button variant="destructive" size="lg" loading>
  Delete Account
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

### Form Components

```tsx
import { Input, Checkbox, RadioGroup, Select } from '@/components/ui'

// Input with validation
<Input
  placeholder="Email"
  error="Invalid email"
  helperText="We'll never share your email"
/>

// Checkbox with description
<Checkbox
  label="Accept terms"
  description="By checking this, you agree to our terms"
/>

// Radio group
<RadioGroup
  name="plan"
  options={[
    { value: 'basic', label: 'Basic', description: 'For individuals' },
    { value: 'pro', label: 'Pro', description: 'For teams' }
  ]}
  value={selectedPlan}
  onChange={setSelectedPlan}
/>

// Enhanced Select
<Select
  options={selectOptions}
  placeholder="Choose an option..."
  error="This field is required"
/>
```

### Data Table

```tsx
import { DataTable } from '@/components/ui/DataTable'

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  // ... more columns
]

<DataTable
  columns={columns}
  data={userData}
  enableSorting
  enableFiltering
  enablePagination
/>
```

### Modal

```tsx
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/ui/Modal'
;<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

## 🌙 Theming

The project includes a comprehensive theming system using CSS variables:

```tsx
import { useTheme } from '@/components/ThemeProvider'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="outline" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </Button>
  )
}
```

Themes are automatically applied using CSS variables defined in your CSS:

- `--primary`, `--secondary`, `--background`, `--foreground`
- Supports light, dark, and system preference detection
- CSS variables ensure consistent theming across all components

## 🧪 Testing

Comprehensive testing setup with organized structure:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test:run
```

Tests are located in the `__tests__` directory with mirrors the `src` structure:

- Component tests in `__tests__/components/`
- Utility tests in `__tests__/lib/`
- Integration tests in `__tests__/integration/`

## ♿ Accessibility

All components are built with accessibility in mind:

- Proper ARIA attributes and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance
- ESLint rules for accessibility

## 🔧 Development Tools

### ESLint Configuration

- TypeScript support with strict rules
- React hooks validation
- Accessibility rules (jsx-a11y)
- Import/export validation
- Prettier integration

### Git Hooks (Husky)

- Pre-commit: Lint, format, and test
- Automated code quality checks
- Prevents bad commits

### API Client

Enhanced Axios client with:

```tsx
import { apiClient } from '@/lib/api'

// With caching
const users = await apiClient.get('/users', {}, { cache: true, ttl: 300000 })

// Automatic error handling and token management
const newUser = await apiClient.post('/users', userData)
```

## 📦 State Management

### Zustand Store

```tsx
import { useAppStore } from '@/store/appStore'

function MyComponent() {
  const { user, setUser, theme, setTheme } = useAppStore()

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <Button onClick={() => setTheme('dark')}>Switch to Dark Mode</Button>
    </div>
  )
}
```

### React Query Integration

```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

function UserProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.get('/user'),
  })

  const updateUser = useMutation({
    mutationFn: (userData) => apiClient.put('/user', userData),
    onSuccess: () => queryClient.invalidateQueries(['user']),
  })

  if (isLoading) return <div>Loading...</div>

  return <div>{user.name}</div>
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Platforms

Ready for deployment on:

- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting
- **Docker** - Containerized deployment

### Environment Variables

```bash
# Required for API integration
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Your App Name
VITE_APP_VERSION=1.0.0
```

## 📋 Code Quality

### Pre-commit Hooks

Automatically runs on every commit:

- ESLint with auto-fix
- Prettier formatting
- TypeScript type checking
- Test execution

### Validation Command

```bash
npm run validate
```

Runs all quality checks: linting, type checking, and tests.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the code style
4. Run validation: `npm run validate`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vite.dev/) - Fast build tool
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TanStack](https://tanstack.com/) - React Query and Table
- [Radix UI](https://radix-ui.com/) - Accessible primitives
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

---

**Ready to build something amazing!** 🎉

This boilerplate provides everything you need for professional React development with modern tools, comprehensive UI components, and best practices built-in.
