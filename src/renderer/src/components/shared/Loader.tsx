import { Loader } from 'lucide-react'
import { ReactElement } from 'react'

export const AnimatedLoader = ({ className }: { className?: string }): ReactElement => (
  <Loader className={`text-muted animate-spin [animation-duration:3s] ${className}`} />
)
