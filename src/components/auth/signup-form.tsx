'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { signUp } from '@/lib/actions'

import BlueskyLogo from '@/components/header/bluesky-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
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
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
})

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', email: '' },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    const result = await signUp(values.email, values.username)
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
              name="username"
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                  This is your public email address.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
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
