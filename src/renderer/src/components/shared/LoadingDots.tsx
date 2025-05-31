import { useEffect, useState } from 'react'
import { ReactElement } from 'react'

export const LoadingDots = (): ReactElement => {
  const [dotIndex, setDotIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % 3)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {dotIndex === 0 && '.'}
      {dotIndex === 1 && '..'}
      {dotIndex === 2 && '...'}
    </>
  )
}
