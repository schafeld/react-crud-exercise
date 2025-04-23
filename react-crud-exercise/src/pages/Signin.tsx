// import { Link } from "react-router";
import { useState } from 'react'
import illustration from '../assets/kellen-riggin-ZHnTWmiz000-unsplash.jpg'

export default function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const {email, password } = formData
  // const [error, setError] = useState('')

  return (
    <section className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Sign In</h1>
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
          <form className="flex flex-col space-y-4 h-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              className="border border-gray-300 p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}