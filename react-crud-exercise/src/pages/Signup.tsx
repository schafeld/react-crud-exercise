import { useState } from 'react'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import OAuth from '../components/OAuth'
import illustration from '../assets/adam-cai-_Sp4jNiW_j0-unsplash.jpg'

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastname: '',
    email: '',
    password: ''
  })
  const { firstName, lastname, email, password } = formData

  const [passwordVisible, setPasswordVisible] = useState(false)
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }

  return (
    <section className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Sign Up</h1>
      <div className="wrapper flex flex-col lg:flex-row w-full lg:space-x-4 space-y-4 lg:space-y-0 mt-6">
        <div className="lg:w-1/2 w-full wrapper-illustration order-1 lg:order-0 mt-4 lg:mt-0">
          <img
            src={illustration}
            className="w-full h-full object-cover rounded max-h-320 lg:max-h-96"
            alt="Photo of a winding road with a tree on the side"
            data-attribution-text="Photo by Kellen Riggin on Unsplash"
            data-attribution-link="https://unsplash.com/de/fotos/eine-kurvige-strasse-mit-einem-baum-an-der-seite-ZHnTWmiz000"
            data-license="https://unsplash.com/license"
          />
        </div>
        <div className="lg:w-1/2 w-full wrapper-form order-0 lg:order-1 h-full">
          <form className="flex flex-col space-y-4 h-full pt-6">
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
                value={lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
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