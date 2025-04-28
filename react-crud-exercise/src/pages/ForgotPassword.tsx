import { useState } from 'react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import OAuth from '../components/OAuth'
import illustration from '../assets/nick-fewings-bTRsbY5RLr4-unsplash.jpg'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: ''
  })
  const { email } = formData

  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)
    const auth = getAuth()
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Password reset email sent! Please check your inbox.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to send reset email.')
      } else {
        setError('An unknown error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Forgot Password</h1>
      <div className="wrapper flex flex-col lg:flex-row w-full lg:space-x-4 space-y-4 lg:space-y-0 mt-6">
        <div className="lg:w-1/2 w-full wrapper-illustration order-1 lg:order-0 mt-4 lg:mt-0">
          <img
            src={illustration}
            className="w-full h-full object-cover rounded max-h-320 lg:max-h-96"
            alt="Photo of a winding road with a tree on the side"
            data-attribution-text="Photo by Nick Fewings on Unsplash"
            data-attribution-link="https://unsplash.com/de/fotos/ein-willkommensschild-mit-einem-smiley-bTRsbY5RLr4"
            data-license="https://unsplash.com/license"
          />
        </div>
        <div className="lg:w-1/2 w-full wrapper-form order-0 lg:order-1 h-full">
          {message && (
            <div className="mb-4 text-green-600 bg-green-100 border border-green-300 rounded p-2">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded p-2">
              {error}
            </div>
          )}
          <form className="flex flex-col space-y-4 h-full pt-6" onSubmit={handleSubmit}>
            <FloatLabel className='w-full mb-8'>
              <InputText
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-0 block px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:outline-none focus:border-black w-full"
                disabled={loading}
              />
              <label
                htmlFor="email"
                className="mt-0 block px-0 border-0 w-fit text-gray-500 transition-all duration-200 ease-in-out translate-y-[-8px]"
              >
                Email
              </label>
            </FloatLabel>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 hover:shadow-lg active:bg-blue-800 active:shadow-none"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="flex items-center mt-2 before:border-gray-300 before:flex-1 before:border-t after:border-gray-300 after:border-t after:flex-1">
            <span className="text-center text-gray-500 mx-4">or</span>
          </div>

          <div className="flex flex-col items-center justify-center mt-6">
            <OAuth label="Sign Up with Google" />
          </div>

          <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-gray-500">
              Don't have an account yet?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}