import {
  forwardRef,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useId,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}

interface ModalContextValue {
  registerTitle: (id: string) => void
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

const Modal = ({
  open,
  onClose,
  children,
  className,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  const generatedId = useId()
  const [labelledBy, setLabelledBy] = useState<string>(generatedId)

  const registerTitle = (id: string) => {
    setLabelledBy(id)
  }

  useEffect(() => {
    if (!open) return
    previousActiveElementRef.current = document.activeElement as HTMLElement

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    const handleTab = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'))

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTab)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTab)
      document.body.style.overflow = ''
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [open, closeOnEscape, onClose])

  useLayoutEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    const focusable = dialog?.querySelector<HTMLElement>(
      'button:not([disabled]):not([aria-label="Close modal"]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
  }, [open, children])

  if (!open) return null

  return createPortal(
    <ModalContext.Provider value={{ registerTitle }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          data-testid="modal-backdrop"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={dialogRef}
          className={cn(
            'relative w-full rounded-lg bg-background p-6 shadow-lg',
            modalSizes[size],
            'animate-in fade-in-0 zoom-in-95 duration-300',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy ?? undefined}
        >
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  )
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('modal-header mb-4 pr-8', className)} {...props}>
      {children}
    </div>
  )
)
ModalHeader.displayName = 'ModalHeader'

const ModalTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, id, ...props }, ref) => {
    const context = useContext(ModalContext)
    const titleId = id ?? 'modal-title'

    useEffect(() => {
      context?.registerTitle(titleId)
    }, [context, titleId])

    return (
      <h2
        ref={ref}
        id={titleId}
        className={cn('modal-title text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      >
        {children}
      </h2>
    )
  }
)
ModalTitle.displayName = 'ModalTitle'

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('modal-body mb-6', className)} {...props}>
      {children}
    </div>
  )
)
ModalBody.displayName = 'ModalBody'

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('modal-footer flex justify-end space-x-2', className)} {...props}>
      {children}
    </div>
  )
)
ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter }
