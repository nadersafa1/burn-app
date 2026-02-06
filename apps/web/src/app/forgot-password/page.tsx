'use client'

import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'

import { authClient } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [sent, setSent] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: '/reset-password',
      })
      if (error) {
        toast.error(error.message || 'Failed to send reset link')
        return
      }
      setSent(true)
      toast.success('Check your email for a reset link')
    },
    validators: {
      onSubmit: z.object({
        email: z.email('Invalid email address'),
      }),
    },
  })

  if (sent) {
    return (
      <div className='mx-auto w-full mt-10 max-w-md p-6'>
        <h1 className='mb-6 text-center text-3xl font-bold'>Check your email</h1>
        <p className='mb-6 text-center text-muted-foreground'>
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
        <div className='text-center'>
          <Link href='/login' className='underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-800'>
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full mt-10 max-w-md p-6'>
      <h1 className='mb-6 text-center text-3xl font-bold'>Forgot password</h1>
      <p className='mb-6 text-center text-muted-foreground'>
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-4'
      >
        <form.Field name='email'>
          {field => (
            <div className='space-y-2'>
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                name={field.name}
                type='email'
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map(error => (
                <p key={error?.message} className='text-red-500'>
                  {error?.message}
                </p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Subscribe>
          {state => (
            <Button type='submit' className='w-full' disabled={!state.canSubmit || state.isSubmitting}>
              {state.isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className='mt-4 text-center'>
        <Link href='/login' className='underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-800'>
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
