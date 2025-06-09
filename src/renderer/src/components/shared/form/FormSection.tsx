import { ReactElement } from 'react'

export const FormSection = ({
  children
}: {
  children: ReactElement | ReactElement[]
}): ReactElement => <div className="space-y-4 flex flex-col py-3">{children}</div>
