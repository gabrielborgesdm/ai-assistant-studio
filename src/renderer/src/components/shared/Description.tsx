import { ReactElement } from 'react'

export const Description = ({ children }: { children: React.ReactNode }): ReactElement => {
  return <div className="text-sm text-muted-foreground">{children}</div>
}
