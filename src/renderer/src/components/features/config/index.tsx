'use client'

import { Shortcut } from '@renderer/components/features/config/Shortcut'
import { Startup } from '@renderer/components/features/config/Startup'
import { BackButton } from '@renderer/components/shared/BackButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { ReactElement } from 'react'

export const ConfigComponent = (): ReactElement => {
  return (
    <div className="min-h-screen w-full p-4 space-y-4 ">
      <BackButton />
      <div className="mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">AI Assistant Studio Settings</CardTitle>
            <CardDescription>Configure the application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form>
              <Shortcut />
              <Startup />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
