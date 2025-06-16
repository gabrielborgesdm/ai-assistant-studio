import { useCallback, useEffect, useRef, useState } from 'react'

interface ScrollState {
  isAtBottom: boolean
  autoScrollEnabled: boolean
}

interface UseAutoScrollOptions {
  offset?: number
  smooth?: boolean
  content?: React.ReactNode
}

export function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const { offset = 5, smooth = false, content } = options
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastContentHeight = useRef(0)

  const [scrollState, setScrollState] = useState<ScrollState>({
    isAtBottom: true,
    autoScrollEnabled: true
  })

  // Soft check (with buffer) for UI hints
  const checkIsAtBottom = useCallback(
    (el: HTMLElement) => {
      const dist = el.scrollHeight - el.scrollTop - el.clientHeight
      return dist <= offset
    },
    [offset]
  )

  // Strict check (no buffer) for auto-scroll logic
  const isReallyAtBottom = useCallback((el: HTMLElement) => {
    return Math.floor(el.scrollTop + el.clientHeight) >= Math.floor(el.scrollHeight)
  }, [])

  const scrollToBottom = useCallback(
    (instant?: boolean) => {
      const el = scrollRef.current
      if (!el) return

      const target = el.scrollHeight - el.clientHeight

      if (instant) {
        el.scrollTop = target
      } else {
        el.scrollTo({
          top: target,
          behavior: smooth ? 'smooth' : 'auto'
        })
      }

      setScrollState({
        isAtBottom: true,
        autoScrollEnabled: true
      })
    },
    [smooth]
  )

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const atBottom = checkIsAtBottom(el)
    const reallyAtBottom = isReallyAtBottom(el)

    if (!reallyAtBottom) {
      // User scrolled up — disable auto-scroll
      setScrollState((prev) => ({
        ...prev,
        isAtBottom: atBottom,
        autoScrollEnabled: false
      }))
    } else {
      // Only re-enable if previously disabled
      setScrollState((prev) => {
        if (!prev.autoScrollEnabled) {
          return {
            isAtBottom: true,
            autoScrollEnabled: true
          }
        }
        return prev
      })
    }
  }, [checkIsAtBottom, isReallyAtBottom])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const currentHeight = el.scrollHeight
    const hasNewContent = currentHeight !== lastContentHeight.current

    if (hasNewContent && scrollState.autoScrollEnabled) {
      setTimeout(() => {
        scrollToBottom(lastContentHeight.current === 0)
      }, 0) // delay ensures layout settles first
    }

    lastContentHeight.current = currentHeight
  }, [content, scrollState.autoScrollEnabled, scrollToBottom])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const resizeObserver = new ResizeObserver(() => {
      if (scrollState.autoScrollEnabled) {
        scrollToBottom(true)
      }
    })

    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [scrollState.autoScrollEnabled, scrollToBottom])

  const disableAutoScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    if (!isReallyAtBottom(el)) {
      setScrollState((prev) => ({
        ...prev,
        autoScrollEnabled: false
      }))
    }
  }, [isReallyAtBottom])

  return {
    scrollRef,
    isAtBottom: scrollState.isAtBottom,
    autoScrollEnabled: scrollState.autoScrollEnabled,
    scrollToBottom: () => scrollToBottom(false),
    disableAutoScroll
  }
}
