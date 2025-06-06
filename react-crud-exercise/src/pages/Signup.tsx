import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import OAuth from '../components/OAuth'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.ts'
import illustration from '../assets/adam-cai-_Sp4jNiW_j0-unsplash.jpg'

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const { firstName, lastName, email, password } = formData;
  const navigate = useNavigate()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }

  const toast = useRef<Toast>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { password, ...formDataCopy } = { ...formData, timestamp: serverTimestamp() } as { timestamp: ReturnType<typeof serverTimestamp>; firstName: string; lastName: string; email: string; password: string; displayName?: string; uid?: string; providerId?: string; }
      console.log('Form data COPY:', formDataCopy)

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: `${firstName} ${lastName}`
        })
      } else {
        console.error('No authenticated user found.')
      }
      const user = userCredential.user
      console.info('User created:', user)

      // Add displayName to formDataCopy
      formDataCopy.displayName = `${firstName} ${lastName}`
      // Add uid and providerId to formDataCopy
      formDataCopy.uid = user.uid
      const providerId = user.providerData[0]?.providerId || '';
      formDataCopy.providerId = providerId;

      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      console.info('User data saved to Firestore:', formDataCopy)

      toast.current?.show({
        severity: 'success',
        summary: 'User Registration Successful',
        detail: 'You have successfully registered.',
        life: 5000
      })
      console.info('User registration successful:', formDataCopy)
      // Redirect to the home page after successful signup with a delay
      setTimeout(() => {
        toast.current?.clear()
        navigate('/')
      }, 5000)

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error during form submission:', error.message)
        toast.current?.show({
          severity: 'error',
          summary: 'User Registration Failed',
          detail: error.message || 'An error occurred during signup.',
          life: 5000
        })
      } else {
        console.error('Unexpected error during form submission:', error)
        toast.current?.show({
          severity: 'error',
          summary: 'Signup Failed',
          detail: 'An unexpected error occurred during signup.',
          life: 5000
        })
      }
    }
  }

  return (
    <section className="flex flex-col items-center justify-center bg-gray-100 p-6">


      <Toast
        ref={toast}
        content={({ message }) => (
            <div className="flex flex-col items-center">
            <h3 className="text-gray-500 mt-2 font-bold">
            {message.summary}
            </h3>
            <p className="text-gray-500 mt-2">
            {message.detail}
            </p>
            <Button
              label="Close"
              icon="pi pi-times mr-2"
              className="mt-2 p-button-secondary mb-4"
              iconPos="left"
              onClick={() => {
                toast.current?.clear()
              }
              }
            />
            </div>
        )}
        // There must be NO padding (e.g. p-4) here, else the toast will not disappear completely.
        className="w-150 max-w-md bg-amber-100 shadow-lg rounded-lg opacity-100 mt-4"
        position="top-center"
      />

      <h1 className="text-4xl font-bold text-gray-800 mt-6">Sign Up</h1>
      <div className="wrapper flex flex-col lg:flex-row w-full lg:space-x-4 space-y-4 lg:space-y-0 mt-6">
      <div className="lg:w-1/2 w-full wrapper-illustration order-1 lg:order-0 mt-4 lg:mt-0">
        <img
        src={illustration}
        className="w-full h-full object-cover rounded max-h-320 lg:max-h-96"
        alt="Photo of a winding road with a tree on the side"
        data-attribution-text="Photo by Adam Cai on Unsplash"
        data-attribution-link="https://unsplash.com/de/fotos/ein-rettungsschwimmer-der-an-einer-wand-hangt-mit-einem-willkommensschild-an-bord-_Sp4jNiW_j0"
        data-license="https://unsplash.com/license"
        />
      </div>
      <div className="lg:w-1/2 w-full wrapper-form order-0 lg:order-1 h-full">
        <form className="flex flex-col space-y-4 h-full pt-6"
        onSubmit={onSubmit}
        >
        <FloatLabel className="w-full mb-8">
          <InputText
          id="firstName"
          type="text"
          autoFocus
          value={firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="mt-0 block px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:outline-none focus:border-black w-full"
          />
          <label
          htmlFor="firstName"
          className="mt-0 block px-0 border-0 w-fit text-gray-500 transition-all duration-200 ease-in-out translate-y-[-8px]"
          >
          First Name
          </label>
        </FloatLabel>

        <FloatLabel className="w-full mb-8">
          <InputText
          id="lastname"
          type="text"
          value={lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="mt-0 block px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:outline-none focus:border-black w-full"
          />
          <label
          htmlFor="lastname"
          className="mt-0 block px-0 border-0 w-fit text-gray-500 transition-all duration-200 ease-in-out translate-y-[-8px]"
          >
          Last Name
          </label>
        </FloatLabel>

        <FloatLabel className="w-full mb-8">
          <InputText
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-0 block px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:outline-none focus:border-black w-full"
          />
          <label
          htmlFor="email"
          className="mt-0 block px-0 border-0 w-fit text-gray-500 transition-all duration-200 ease-in-out translate-y-[-8px]"
          >
          Email
          </label>
        </FloatLabel>

        <FloatLabel className="w-full mb-8 relative">
          <InputText
          id="password"
          type={passwordVisible ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-0 block px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:outline-none focus:border-black w-full pr-10"
          />
          <label
          htmlFor="password"
          className="mt-0 block px-0 border-0 w-fit text-gray-500 transition-all duration-200 ease-in-out translate-y-[-8px]"
          >
          Password
          </label>
          {password.length > 0 && (
          <Button
            icon={passwordVisible ? "pi pi-eye" : "pi pi-eye-slash"}
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-0 bottom-1 text-gray-500 hover:text-gray-700 focus:outline-none p-1 text-sm"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          />
          )}
        </FloatLabel>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 hover:shadow-lg active:bg-blue-800 active:shadow-none"
        >
          Sign Up
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
          Have an account already?{' '}
          <a href="/signin" className="text-blue-500 hover:underline">
          Sign In.
          </a>
        </p>
        <p className="text-gray-500 mt-3">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
          Forgot your password?
          </a>
        </p>
        </div>
      </div>
      </div>
    </section>
  )
}