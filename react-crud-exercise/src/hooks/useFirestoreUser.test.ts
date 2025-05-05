import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFirestoreUser } from './useFirestoreUser'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthStatus } from './useAuthStatus'

// Mock dependencies
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn()
}))

vi.mock('./useAuthStatus', () => ({
  useAuthStatus: vi.fn()
}))

describe('useFirestoreUser hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null userData when user is not logged in', async () => {
    // Setup
    vi.mocked(useAuthStatus).mockReturnValue({
      currentUser: null,
      checkingStatus: false,
      loggedIn: false
    })

    // Execute
    const { result } = renderHook(() => useFirestoreUser())

    // Verify
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.userData).toBe(null)
      expect(result.current.error).toBe(null)
    })
    
    // Firebase functions shouldn't be called
    expect(doc).not.toHaveBeenCalled()
    expect(getDoc).not.toHaveBeenCalled()
  })

  it('should fetch user data from Firestore when user is logged in', async () => {
    // Setup
    const mockUser = {
      uid: '123',
      displayName: 'Test User',
      email: 'test@example.com'
    }
    
    const mockFirestoreData = {
      displayName: 'Firestore User',
      email: 'firestore@example.com',
      photoURL: 'https://example.com/photo.jpg'
    }
    
    vi.mocked(useAuthStatus).mockReturnValue({
      currentUser: mockUser as any,
      checkingStatus: false,
      loggedIn: true
    })
    
    const mockDocRef = { id: '123' }
    vi.mocked(doc).mockReturnValue(mockDocRef as any)
    
    const mockDocSnap = {
      exists: () => true,
      data: () => mockFirestoreData
    }
    vi.mocked(getDoc).mockResolvedValue(mockDocSnap as any)

    // Execute
    const { result } = renderHook(() => useFirestoreUser())

    // Verify
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.userData).toEqual(mockFirestoreData)
      expect(result.current.error).toBe(null)
    })
    
    expect(doc).toHaveBeenCalled()
    expect(getDoc).toHaveBeenCalledWith(mockDocRef)

    // Verify user id with flexible approach
    expect(vi.mocked(doc).mock.calls.some(call => 
      call.includes('users') && call.includes('123')
    )).toBe(true);
  })
})