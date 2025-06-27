'use client'

import { ModelsRemoval } from '@renderer/components/features/config/ModelsRemoval'
import { Shortcut } from '@renderer/components/features/config/Shortcut'
import { Startup } from '@renderer/components/features/config/Startup'
import { BackButton } from '@renderer/components/shared/BackButton'
import { ReactElement } from 'react'

export const ConfigComponent = (): ReactElement => {
  return (
    <div className="min-h-screen w-full p-4 space-y-4 ">
      <BackButton />
      <div className="mx-auto w-full space-y-4">
        <Shortcut />
        <Startup />
        <ModelsRemoval />
      </div>
    </div>
  )
}
