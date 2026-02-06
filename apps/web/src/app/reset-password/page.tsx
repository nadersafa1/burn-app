'use client'

import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { toast } from 'sonner'
import z from 'zod'

import { authClient } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error('Invalid or missing reset link')
        return
      }
      const { error } = await authClient.resetPassword({
        newPassword: value.newPassword,
        token,
      })
      if (error) {
        if (error.code === 'INVALID_TOKEN') {
          toast.error('Reset link is invalid or expired')
        } else {
          toast.error(error.message || 'Failed to reset password')
        }
        return
      }
      toast.success('Password reset successful')
      router.push('/login?message=password_reset')
    },
    validators: {
      onSubmit: z
        .object({
          newPassword: z.string().min(8, 'Password must be at least 8 characters'),
          confirmPassword: z.string(),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        }),
    },
  })

  if (!token) {
    return (
      <div className='mx-auto w-full mt-10 max-w-md p-6'>
        <h1 className='mb-6 text-center text-3xl font-bold'>Invalid reset link</h1>
        <p className='mb-6 text-center text-muted-foreground'>
          This reset link is invalid or has expired. Please request a new one.
        </p>
        <div className='text-center'>
          <Link
            href='/forgot-password'
            className='underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-800'
          >
            Request new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full mt-10 max-w-md p-6'>
      <h1 className='mb-6 text-center text-3xl font-bold'>Set new password</h1>
      <p className='mb-6 text-center text-muted-foreground'>Enter your new password below.</p>

      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className='space-y-4'
      >
        <form.Field name='newPassword'>
          {field => (
            <div className='space-y-2'>
              <Label htmlFor={field.name}>New password</Label>
              <Input
                id={field.name}
                name={field.name}
                type='password'
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

        <form.Field name='confirmPassword'>
          {field => (
            <div className='space-y-2'>
              <Label htmlFor={field.name}>Confirm password</Label>
              <Input
                id={field.name}
                name={field.name}
                type='password'
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
              {state.isSubmitting ? 'Resetting...' : 'Reset password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className='mx-auto w-full mt-10 max-w-md p-6 text-center'>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
