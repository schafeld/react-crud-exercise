import { describe, it, expect, vi } from 'vitest'

// --- Firebase mocks ---
vi.mock('firebase/auth', () => ({
  getAuth: () => ({
    currentUser: { uid: 'test-user' }
  })
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}))

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(() => ({
    on: vi.fn(),
    snapshot: { ref: {} }
  })),
  getDownloadURL: vi.fn(() => Promise.resolve('https://test-url')),
  deleteObject: vi.fn(),
}))
// --- End Firebase mocks ---

import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CreateListing from './CreateListing'

describe('CreateListing component', () => {
  it('renders the create listing form', () => {
    render(
      <BrowserRouter>
        <CreateListing />
      </BrowserRouter>
    )

    // Check for heading
    expect(screen.getByText('Create a product listing')).toBeInTheDocument()
    
    // Check for form elements
    expect(screen.getByText('New article')).toBeInTheDocument()
    expect(screen.getByText('Second hand')).toBeInTheDocument()
    expect(screen.getByLabelText(/Listing Title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Number of items/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Max items per customer/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Short Product description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Detailled product description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Price \(per item\)/i)).toBeInTheDocument()
    // Check for the image selector label
    expect(screen.getByText('Select files')).toBeInTheDocument()
  })

  it('updates form state when inputs change', () => {
    render(
      <BrowserRouter>
        <CreateListing />
      </BrowserRouter>
    )

    // Get input elements
    const titleInput = screen.getByLabelText(/Listing Title/i)
    const shortDescInput = screen.getByLabelText(/Short Product description/i)
    
    // Change input values
    fireEvent.change(titleInput, { target: { value: 'Test Product' } })
    fireEvent.change(shortDescInput, { target: { value: 'This is a test description' } })
    
    // Check if input values were updated
    expect(titleInput).toHaveValue('Test Product')
    expect(shortDescInput).toHaveValue('This is a test description')
  })

  it('toggles between new and second hand', () => {
    render(
      <BrowserRouter>
        <CreateListing />
      </BrowserRouter>
    )

    const newButton = screen.getByText('New article')
    const secondHandButton = screen.getByText('Second hand')
    
    // Initially, new article should be selected
    expect(newButton).toHaveClass('bg-blue-600')
    expect(secondHandButton).not.toHaveClass('bg-blue-600')
    
    // Click second hand button
    fireEvent.click(secondHandButton)
    
    // Now second hand should be selected
    expect(newButton).not.toHaveClass('bg-blue-600')
    expect(secondHandButton).toHaveClass('bg-blue-600')
  })

  it('calls onFilesChange when files are selected', () => {
    render(
      <BrowserRouter>
        <CreateListing />
      </BrowserRouter>
    )

    // The input is hidden, but we can get it by its id
    const fileInput = screen.getByLabelText('Select files')
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // The file name should appear in the list
    expect(screen.getByText('test.png')).toBeInTheDocument()
  })
})