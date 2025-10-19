import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { Button } from './Button'

export interface DropdownItem {
  key: string
  label: string
  value?: string
  disabled?: boolean
  separator?: boolean
  onClick?: () => void
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  className?: string
  contentClassName?: string
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  disabled?: boolean
}

const Dropdown = ({
  trigger,
  items,
  className,
  contentClassName,
  placement = 'bottom-start',
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  }

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-[200px] rounded-md border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95',
            placementClasses[placement],
            contentClassName
          )}
        >
          {items.map((item) => {
            if (item.separator) {
              return <div key={item.key} className="my-1 h-px bg-border" />
            }

            return (
              <button
                key={item.key}
                className={cn(
                  'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  item.disabled && 'pointer-events-none opacity-50'
                )}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.()
                    setIsOpen(false)
                  }
                }}
                disabled={item.disabled}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Pre-built dropdown trigger button
export const DropdownTrigger = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" {...props}>
    {children}
    <ChevronDown className="ml-2 h-4 w-4" />
  </Button>
)

export { Dropdown }