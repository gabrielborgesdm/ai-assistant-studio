import { ReactElement, useEffect } from 'react'

interface FullscreenImageProps {
  src?: string
  onClose: () => void
}

export const FullscreenImage = ({ src, onClose }: FullscreenImageProps): ReactElement => {
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') onClose()
    })
    return () => {
      document.removeEventListener('keydown', (e) => {
        if (e.key === 'Escape') onClose()
      })
    }
  }, [onClose])

  if (!src) return <></>

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={onClose}
      onKeyDownCapture={(e) => {
        console.log(e.key)
        if (e.key === 'Escape') onClose()
      }}
    >
      <img src={src} className="max-w-full max-h-full" />
    </div>
  )
}
