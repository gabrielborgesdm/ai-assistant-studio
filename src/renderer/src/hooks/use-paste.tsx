import { useEffect } from 'react'

// identify mouse right click and paste from clipboard
export const usePasteOnRightClick = (
  ref: React.RefObject<HTMLTextAreaElement | null>,
  setValue: (value: string) => void
): void => {
  useEffect((): (() => void) | undefined => {
    const textarea = ref?.current
    if (!textarea) return

    const handleContextMenu = async (e: MouseEvent): Promise<void> => {
      if (e.button !== 2) return // Only handle right-click

      e.preventDefault() // Prevent default context menu

      try {
        // Check if clipboard API is available
        if (!navigator.clipboard) {
          console.warn('Clipboard API not available')
          return
        }

        // Get text from clipboard
        const text = await navigator.clipboard.readText()
        if (!text) return

        // Get cursor position
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const value = textarea.value

        // Insert text at cursor position
        textarea.value = value.substring(0, start) + text + value.substring(end).trim()

        // Update cursor position
        const newCursorPos = start + text.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)

        // Trigger input event to update React state
        const event = new Event('input', { bubbles: true })
        textarea.dispatchEvent(event)
        console.log('textarea value', textarea.value)
        setValue(textarea.value)
      } catch (error) {
        console.error('Failed to paste from clipboard:', error)
      }
    }

    textarea.addEventListener('contextmenu', handleContextMenu)

    return (): void => {
      textarea.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [ref])
}
