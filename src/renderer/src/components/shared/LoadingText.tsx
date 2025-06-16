import { ReactElement, useEffect, useState } from 'react'
import { LoadingDots } from '@/components/shared/LoadingDots'

export const LoadingText = (): ReactElement => {
  // Array of loading messages to cycle through
  const statuses = ['Installing', 'Verifying', 'Almost there', 'This might take a moment']
  // State to track the current status message index
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    // Set up an interval to cycle through status messages every 60 seconds
    const interval = setInterval(() => {
      // If the last status message has been reached, clear the interval
      setStatusIndex((prev) => {
        if (prev === statuses.length - 1) {
          clearInterval(interval)
          return prev
        }

        return prev + 1
      })
    }, 60000)
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])

  return (
    <span>
      {statuses[statusIndex]}
      <LoadingDots />
    </span>
  )
}
