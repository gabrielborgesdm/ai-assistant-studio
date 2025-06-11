export const useHandleCopy = (): { handleCopy: (text: string) => void } => {
  const handleCopy = (text: string): void => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(text)
  }

  return { handleCopy }
}
