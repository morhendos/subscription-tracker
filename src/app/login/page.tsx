'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useCallback, Suspense } from 'react'
import { validateEmail, validatePassword } from '@/lib/auth/validation'
import { Section } from '@/components/common/Section'
import { LogIn, AlertCircle } from 'lucide-react'
import AuthLogo from '@/components/auth/AuthLogo'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

const USERS_STORAGE_KEY = 'st_users';

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-destructive">{message}</p>
        </div>
      </div>
    </div>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = useCallback((email: string, password: string): boolean => {
    const newErrors: FormErrors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      if (!validateForm(email, password)) {
        setIsLoading(false)
        return
      }

      const usersJson = localStorage.getItem(USERS_STORAGE_KEY) || '[]';
      const result = await signIn('credentials', {
        email,
        password,
        usersJson,
        redirect: false,
        callbackUrl
      })

      if (!result?.ok) {
        setErrors({
          general: result?.error || 'Authentication failed'
        })
        return
      }

      router.push(callbackUrl)
      router.refresh()

    } catch (error) {
      console.error('Login error:', error)
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const FormError = ({ message }: { message?: string }) => (
    message ? <p className="text-sm text-destructive mt-1">{message}</p> : null
  )

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <main className="container mx-auto h-screen px-3 py-4 sm:px-4 sm:py-12 max-w-6xl relative flex items-center justify-center">
        <Section title="" className="min-w-[450px]">
          <div className="w-full max-w-md mx-auto">
            <AuthLogo />

            <form method="POST" onSubmit={handleSubmit} className="space-y-6">
              {errors.general && <ErrorAlert message={errors.general} />}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <FormError message={errors.email} />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <FormError message={errors.password} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <LogIn size={18} className="group-hover:scale-105 transition-transform" strokeWidth={1.5} />
                <span>{isLoading ? 'Logging in...' : 'Log in'}</span>
              </button>

              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-blue-500 hover:text-blue-400 hover:underline font-medium dark:text-blue-400 dark:hover:text-blue-300">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </Section>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}