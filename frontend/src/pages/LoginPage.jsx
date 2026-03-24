import { useState } from 'react'
import { LuMail } from 'react-icons/lu'
import { useAuth } from '@/app/hooks'
import { PageShell } from '@/components/layout'
import { GlassPanel, IconInput } from '@/components/ui'

export default function LoginPage() {
  const { loading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setError('Email is required.')
      return
    }

    setIsSubmitting(true)
    setError('')

    const result = await login(normalizedEmail)

    setIsSubmitting(false)

    if (!result.success || !result.user) {
      setError(result.error || 'Unable to verify user')
      return
    }
  }

  return (
    <PageShell centered showNavbar={false}>
      <div className="w-full max-w-[448px]">
        <GlassPanel className="mx-auto w-full" variant="auth">
          <div className="px-8 py-10 md:px-12">
            <div className="text-center">
              <h1 className="text-[2rem] font-normal leading-tight tracking-[-0.03em] text-heading">
                Sign in
              </h1>
              <p className="mt-3 text-[0.95rem] leading-6 text-body">
                Use your registered email to continue to the portal.
              </p>
            </div>

            <form className="mt-8" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-heading">Email</span>
                <IconInput
                  autoComplete="email"
                  icon={LuMail}
                  inputMode="email"
                  inputClassName="text-[0.95rem]"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                />
              </label>

              {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}

              <div className="mt-8 flex items-center justify-center">
                <button
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-card transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting || loading}
                  type="submit"
                >
                  {isSubmitting ? 'Verifying…' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  )
}
