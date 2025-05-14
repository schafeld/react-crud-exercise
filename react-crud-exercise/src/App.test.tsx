import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// --- Mock all page and component imports ---
vi.mock('./components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}))
vi.mock('./components/Navigation', () => ({
  __esModule: true,
  default: () => <div data-testid="navigation">Navigation</div>,
}))
vi.mock('./pages/Home', () => ({
  __esModule: true,
  default: () => <div>Home Page</div>,
}))
vi.mock('./pages/About', () => ({
  __esModule: true,
  default: () => <div>About Page</div>,
}))
vi.mock('./pages/Offers', () => ({
  __esModule: true,
  default: () => <div>Offers Page</div>,
}))
vi.mock('./pages/Profile', () => ({
  __esModule: true,
  default: () => <div>Profile Page</div>,
}))
vi.mock('./pages/Signin', () => ({
  __esModule: true,
  default: () => <div>Signin Page</div>,
}))
vi.mock('./pages/Signup', () => ({
  __esModule: true,
  default: () => <div>Signup Page</div>,
}))
vi.mock('./pages/ForgotPassword', () => ({
  __esModule: true,
  default: () => <div>Forgot Password Page</div>,
}))
vi.mock('./pages/AppLayout', () => ({
  __esModule: true,
  default: () => <div>App Layout Page</div>,
}))
vi.mock('./components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="protected">{children}</div>,
}))
vi.mock('./pages/CreateListing', () => ({
  __esModule: true,
  default: () => <div>Create Listing Page</div>,
}))
vi.mock('./pages/DisplayListing', () => ({
  __esModule: true,
  default: () => <div>Display Listing Page</div>,
}))
vi.mock('./pages/EditListing', () => ({
  __esModule: true,
  default: () => <div>Edit Listing Page</div>,
}))
vi.mock('./pages/SellerProfile', () => ({
  __esModule: true,
  default: () => <div>Seller Profile Page</div>,
}))

describe('App routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('always renders Header and Navigation', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('renders Home page at "/"', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('renders About page at "/about"', () => {
    window.history.pushState({}, '', '/about')
    render(<App />)
    expect(screen.getByText('About Page')).toBeInTheDocument()
  })

  it('renders Signin page at "/signin"', () => {
    window.history.pushState({}, '', '/signin')
    render(<App />)
    expect(screen.getByText('Signin Page')).toBeInTheDocument()
  })

  it('renders Signup page at "/signup"', () => {
    window.history.pushState({}, '', '/signup')
    render(<App />)
    expect(screen.getByText('Signup Page')).toBeInTheDocument()
  })

  it('renders ForgotPassword page at "/forgot-password"', () => {
    window.history.pushState({}, '', '/forgot-password')
    render(<App />)
    expect(screen.getByText('Forgot Password Page')).toBeInTheDocument()
  })

  it('renders Offers page at "/offers"', () => {
    window.history.pushState({}, '', '/offers')
    render(<App />)
    expect(screen.getByText('Offers Page')).toBeInTheDocument()
  })

  it('renders AppLayout at "/app"', () => {
    window.history.pushState({}, '', '/app')
    render(<App />)
    expect(screen.getByText('App Layout Page')).toBeInTheDocument()
  })

  it('renders CreateListing in ProtectedRoute at "/create-listing"', () => {
    window.history.pushState({}, '', '/create-listing')
    render(<App />)
    expect(screen.getByTestId('protected')).toBeInTheDocument()
    expect(screen.getByText('Create Listing Page')).toBeInTheDocument()
  })

  it('renders EditListing in ProtectedRoute at "/edit-listing/:listingId"', () => {
    window.history.pushState({}, '', '/edit-listing/123')
    render(<App />)
    expect(screen.getByTestId('protected')).toBeInTheDocument()
    expect(screen.getByText('Edit Listing Page')).toBeInTheDocument()
  })

  it('renders DisplayListing at "/listing/:listingId"', () => {
    window.history.pushState({}, '', '/listing/456')
    render(<App />)
    expect(screen.getByText('Display Listing Page')).toBeInTheDocument()
  })

  it('renders Profile in ProtectedRoute at "/profile"', () => {
    window.history.pushState({}, '', '/profile')
    render(<App />)
    expect(screen.getByTestId('protected')).toBeInTheDocument()
    expect(screen.getByText('Profile Page')).toBeInTheDocument()
  })

  it('renders SellerProfile at "/seller/:sellerId"', () => {
    window.history.pushState({}, '', '/seller/789')
    render(<App />)
    expect(screen.getByText('Seller Profile Page')).toBeInTheDocument()
  })

  it('renders 404 for unknown route', () => {
    window.history.pushState({}, '', '/unknown-route')
    render(<App />)
    expect(screen.getByText('404 Not Found')).toBeInTheDocument()
  })
})