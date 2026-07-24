import {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  Children,
  cloneElement,
  type ReactNode,
  type HTMLAttributes,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { cn } from '@/lib/utils'

interface DropdownContextValue {
  open: boolean
  disabled: boolean
  toggleOpen: () => void
  close: () => void
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined)

export interface DropdownItemShape {
  key: string
  label: string
  onClick?: () => void
  separator?: boolean
}

export interface DropdownProps {
  children?: ReactNode
  className?: string
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  // legacy/alternate API
  trigger?: ReactElement
  items?: DropdownItemShape[]
}

const placementClasses = {
  'bottom-start': 'top-full left-0 mt-1',
  'bottom-end': 'top-full right-0 mt-1',
  'top-start': 'bottom-full left-0 mb-1',
  'top-end': 'bottom-full right-0 mb-1',
}

const Dropdown = ({
  children,
  className,
  placement = 'bottom-start',
  disabled = false,
  open,
  onOpenChange,
  trigger,
  items,
}: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!isControlled) setInternalOpen(false)
        onOpenChange?.(false)
      }
    }

    const handleEscape = (event: Event) => {
      const e = event as KeyboardEvent
      if (e.key === 'Escape') {
        if (!isControlled) setInternalOpen(false)
        onOpenChange?.(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape as EventListener)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape as EventListener)
    }
  }, [isOpen, isControlled, onOpenChange])

  const toggleOpen = () => {
    if (disabled) return
    if (!isControlled) setInternalOpen((prev) => !prev)
    onOpenChange?.(!isOpen)
  }

  const close = () => {
    if (!isControlled) setInternalOpen(false)
    onOpenChange?.(false)
  }

  // Support legacy trigger/items API: render cloned trigger and auto-generate content
  const triggerNode = trigger
    ? cloneElement(trigger, {
        ...((trigger.props as any) || {}),
        onClick: (e: any) => {
          ;(trigger.props as any).onClick?.(e)
          toggleOpen()
        },
      })
    : null

  return (
    <DropdownContext.Provider value={{ open: isOpen, disabled, toggleOpen, close }}>
      <div ref={dropdownRef} className={cn('relative inline-block', className)}>
        {triggerNode || Children.map(children, (child) => (child ? child : null))}
        {items && isOpen && (
          <div
            className={cn(
              'absolute z-50 mt-1 min-w-[200px] rounded-md border bg-popover p-1 shadow-md',
              placementClasses[placement]
            )}
          >
            {items.map((it) =>
              it.separator ? (
                <div key={it.key} className="my-1 h-px bg-border" />
              ) : (
                <button
                  key={it.key}
                  className="block w-full text-left px-2 py-1 text-sm"
                  onClick={() => {
                    it.onClick?.()
                    close()
                  }}
                >
                  {it.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  )
}

export interface DropdownTriggerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export const DropdownTrigger = ({ children, ...props }: DropdownTriggerProps) => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('DropdownTrigger must be used within Dropdown')
  }

  const { open, disabled, toggleOpen } = context
  const child = Children.only(children) as ReactElement

  const handleClick = (event: ReactMouseEvent) => {
    ;(child.props as any).onClick?.(event)
    toggleOpen()
  }

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleOpen()
    }
    ;(child.props as any).onKeyDown?.(event)
  }

  return cloneElement(child, {
    ...((child.props as any) || {}),
    ...props,
    'aria-haspopup': 'true',
    'aria-expanded': open,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  })
}

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'bottom' | 'top'
  align?: 'start' | 'end'
  children: ReactNode
}

export const DropdownContent = ({
  side = 'bottom',
  align = 'start',
  className,
  children,
  ...props
}: DropdownContentProps) => {
  const context = useContext(DropdownContext)
  const contentRef = useRef<HTMLDivElement | null>(null)

  if (!context) {
    throw new Error('DropdownContent must be used within Dropdown')
  }

  const { open } = context

  useEffect(() => {
    if (!open) return
    const firstItem = contentRef.current?.querySelector<HTMLElement>(
      'button[role="menuitem"]:not([disabled])'
    )
    firstItem?.focus()
  }, [open])

  if (!open) return null

  const placementKey = `${side}-${align}` as keyof typeof placementClasses

  return (
    <div
      ref={contentRef}
      role="menu"
      className={cn(
        'absolute z-50 min-w-[200px] rounded-md border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95',
        placementClasses[placementKey],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  disabled?: boolean
}

export const DropdownItem = ({
  children,
  disabled,
  className,
  onKeyDown,
  ...props
}: DropdownItemProps) => {
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      onKeyDown?.(event)
      return
    }

    const menu = event.currentTarget.closest('[role="menu"]')
    if (!menu) {
      onKeyDown?.(event)
      return
    }

    const items = Array.from(
      menu.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]')
    ).filter((item) => !item.disabled)

    const index = items.indexOf(event.currentTarget)
    if (index === -1) {
      onKeyDown?.(event)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = items[(index + 1) % items.length]
      next?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prev = items[(index - 1 + items.length) % items.length]
      prev?.focus()
    }

    onKeyDown?.(event)
  }

  return (
    <button
      role="menuitem"
      className={cn(
        'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      disabled={disabled}
      aria-disabled={disabled}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  )
}

export { Dropdown }
