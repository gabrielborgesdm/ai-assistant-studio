import { cn } from '@/lib/utils' // Tailwind class merge helper (optional)
import { Upload } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'

interface Props {
  onAddImage: (file: File) => void
  enabled?: boolean
  children: React.ReactNode
}

export const ChatImageDropzone = ({ onAddImage, enabled, children }: Props): ReactElement => {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files: FileList | null): void => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      console.error('Only image files are supported.')
      return
    }
    onAddImage(file)
  }

  const handleDrop = (e: DragEvent): void => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer?.files || null)
  }

  const handlePaste = (e: ClipboardEvent): void => {
    const item = Array.from(e.clipboardData?.items || []).find((i) => i.type.startsWith('image/'))
    if (item) {
      const file = item.getAsFile()
      if (file && enabled) onAddImage(file)
      e.preventDefault()
    }
  }

  useEffect(() => {
    const el = dropRef.current
    if (!el) return

    const handleDragOver = (e: DragEvent): void => {
      e.preventDefault()
      if (!enabled) return
      setIsDragging(true)
    }
    const handleDragLeave = (): void => {
      setIsDragging(false)
    }

    el.addEventListener('dragover', handleDragOver)
    el.addEventListener('dragleave', handleDragLeave)
    el.addEventListener('drop', handleDrop)
    window.addEventListener('paste', handlePaste)

    return () => {
      el.removeEventListener('dragover', handleDragOver)
      el.removeEventListener('dragleave', handleDragLeave)
      el.removeEventListener('drop', handleDrop)
      window.removeEventListener('paste', handlePaste)
    }
  }, [])

  return (
    <div ref={dropRef} className={cn('relative')}>
      {isDragging && (
        <div className="z-50 absolute inset-0 flex items-center justify-center bg-secondary border-2 border-dashed border-foreground gap-2 pointer-events-none">
          <Upload className="size-6 text-foreground" />
        </div>
      )}
      {children}
    </div>
  )
}
