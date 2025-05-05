import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuthStatus } from './useAuthStatus'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Mock Firebase modules
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn()
}))

describe('useAuthStatus hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return initial state with checking status true', () => {
    // Setup
    const mockAuth = {}
    ;(getAuth as any).mockReturnValue(mockAuth)
    ;(onAuthStateChanged as any).mockImplementation(() => () => {})

    // Execute
    const { result } = renderHook(() => useAuthStatus())

    // Verify
    expect(result.current.checkingStatus).toBe(true)
    expect(result.current.loggedIn).toBe(false)
    expect(result.current.currentUser).toBe(null)
    expect(getAuth).toHaveBeenCalled()
    expect(onAuthStateChanged).toHaveBeenCalledWith(mockAuth, expect.any(Function))
  })

  it('should set loggedIn to true when user is authenticated', async () => {
    // Setup
    const mockUser = { uid: '123', email: 'test@example.com' }
    ;(getAuth as any).mockReturnValue({})
    ;(onAuthStateChanged as any).mockImplementation((_, callback) => {
      callback(mockUser)
      return () => {}
    })

    // Execute
    const { result } = renderHook(() => useAuthStatus())

    // Verify
    await waitFor(() => {
      expect(result.current.checkingStatus).toBe(false)
      expect(result.current.loggedIn).toBe(true)
      expect(result.current.currentUser).toBe(mockUser)
    })
  })
})