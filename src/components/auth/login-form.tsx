'use client'

import { signInWithBluesky } from '@/lib/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import BlueskyLogo from '../header/bluesky-logo'

import { ButtonLoading } from '@/components/ui/button-loading'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  handle: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' }),
})

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { handle: '' },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setIsLoading(true)
    const result = await signInWithBluesky(values.handle)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.url) {
      router.push(result.url)
    }
  }
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <BlueskyLogo className="size-4 dark:invert fill-foreground" />
                    Bluesky Handle
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="handle.bsky.social" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <ButtonLoading>Logging in...</ButtonLoading>
            ) : (
              <Button type="submit">Log In</Button>
            )}
          </form>
        </Form>
      </CardContent>
      {error ? (
        <CardFooter>
          {error && <div className="text-red-600 mb-4">{error}</div>}
        </CardFooter>
      ) : null}
    </Card>
  )
}
