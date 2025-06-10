import { Textarea } from '@/components/ui/textarea'
import { ReactElement, useEffect, useRef } from 'react'

interface AutoGrowingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref: any
  watchedValue?: string
}

const AutoGrowingTextarea = (props: AutoGrowingTextareaProps): ReactElement => {
  const { value, watchedValue, className, ...rest } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [watchedValue ?? value])

  return (
    <Textarea
      {...rest}
      ref={(el) => {
        textareaRef.current = el
        props.ref?.(el)
      }}
      value={value}
      onChange={(e) => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
        props.onChange?.(e)
      }}
      className={`resize-none overflow-hidden ${className ?? ''}`}
      rows={1}
    />
  )
}

export default AutoGrowingTextarea
