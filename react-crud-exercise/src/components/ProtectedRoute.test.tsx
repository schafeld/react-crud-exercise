import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuthStatus } from '../hooks/useAuthStatus'

// Mock the useAuthStatus hook
vi.mock('../hooks/useAuthStatus', () => ({
  useAuthStatus: vi.fn()
}))

describe('ProtectedRoute component', () => {
  it('shows loading indicator when checking auth status', () => {
    // Setup mock
    vi.mocked(useAuthStatus).mockReturnValue({
      loggedIn: false,
      checkingStatus: true,
      currentUser: null
    })

    // Render component
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Find the spinner (the component uses PrimeReact's ProgressSpinner)
    const spinner = screen.getByRole('progressbar')
    expect(spinner).toBeInTheDocument()
  })

  it('redirects to sign in when user is not logged in', () => {
    // Setup mock
    vi.mocked(useAuthStatus).mockReturnValue({
      loggedIn: false,
      checkingStatus: false,
      currentUser: null
    })

    // Render component with a route to capture navigation
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          } />
          <Route path="/signin" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Check that we were redirected to sign in
    expect(screen.getByText('Sign In Page')).toBeInTheDocument()
  })

  it('renders children when user is logged in', () => {
    // Setup mock
    vi.mocked(useAuthStatus).mockReturnValue({
      loggedIn: true,
      checkingStatus: false,
      currentUser: { uid: '123' } as any
    })

    // Render component
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    // Check that protected content is rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})