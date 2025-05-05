import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Run cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock Firebase
vi.mock('../firebase', () => {
  const auth = {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  }
  
  return {
    app: {},
    auth: {
      getAuth: vi.fn(() => auth)
    },
    db: {
      getFirestore: vi.fn(),
      doc: vi.fn(),
      getDoc: vi.fn(),
      setDoc: vi.fn(),
      serverTimestamp: vi.fn(),
    }
  }
})