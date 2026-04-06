import { useState } from 'react'
import { LuMail, LuLock } from 'react-icons/lu'
import { useAuth } from '@/app/hooks'
import { PageShell } from '@/components/layout'
import { GlassPanel, IconInput } from '@/components/ui'
import { getAuth, signInWithEmailAndPassword, signInWithCustomToken } from 'firebase/auth'
import { getApp } from 'firebase/app'
import { config } from '@/lib/config'

export default function LoginPage() {
  const { login } = useAuth()
  const [step, setStep] = useState('EMAIL') // 'EMAIL' or 'PASSWORD'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate a persistent Device ID for this browser
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('gdg_device_id')
    if (!deviceId) {
      deviceId = crypto.randomUUID()
      localStorage.setItem('gdg_device_id', deviceId)
    }
    return deviceId
  }

  async function handleEmailCheck(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // 1. Check the email against the backend
      const res = await fetch(`${config.apiBaseUrl}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      if (data.requiresPassword) {
        // It's an admin! Move to step 2.
        setStep('PASSWORD')
      } else {
        // It's a participant! Do passwordless login.
        await handleParticipantLogin()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleParticipantLogin() {
    const res = await fetch(`${config.apiBaseUrl}/auth/participant-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), deviceId: getDeviceId() })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    // Log them into Firebase silently using the custom token!
    const auth = getAuth(getApp())
    await signInWithCustomToken(auth, data.customToken)
    
    // Trigger your app's main login state
    await login(email)
  }

  async function handleAdminLogin(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const auth = getAuth(getApp())
      // Log them in with real passwords
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
      
      // We also need to tell the backend their Device ID (You would make a quick API route for this)
      await fetch(`${config.apiBaseUrl}/auth/update-device`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), deviceId: getDeviceId() })
      })

      await login(email)
    } catch (err) {
      setError('Invalid admin credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell centered showNavbar={false}>
      <div className="w-full max-w-[448px]">
        <GlassPanel className="mx-auto w-full" variant="auth">
          <div className="px-8 py-10 md:px-12">
            <h1 className="text-center text-type-heading text-heading">
              {step === 'EMAIL' ? 'Welcome' : 'Admin Login'}
            </h1>
            
            <form className="mt-8" onSubmit={step === 'EMAIL' ? handleEmailCheck : handleAdminLogin}>
              <label className="block mb-4">
                <span className="mb-2 block text-sm">Email</span>
                <IconInput
                  icon={LuMail}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  disabled={step === 'PASSWORD'} // Lock email if on password step
                />
              </label>

              {step === 'PASSWORD' && (
                <label className="block mb-4">
                  <span className="mb-2 block text-sm">Password</span>
                  <IconInput
                    icon={LuLock}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </label>
              )}

              {error && <p className="text-sm text-error mb-4">{error}</p>}

              <button
                className="w-full rounded-full bg-primary px-8 py-2.5 text-card"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Loading...' : 'Continue'}
              </button>
            </form>
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  )
}
