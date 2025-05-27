/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from 'vitest'
import { vi } from 'vitest'
import type { Mock } from 'vitest'
// Removed duplicate import of Mock
// import type { Mock } from 'vitest'
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
    // Mock getAuth to return a mock auth object
    (getAuth as Mock).mockReturnValue({});
    // Mock onAuthStateChanged to return an unsubscribe function but not call the callback immediately
    // This allows us to check the initial state where checkingStatus is true.
    const mockUnsubscribe = vi.fn();
    (onAuthStateChanged as Mock).mockImplementation(() => mockUnsubscribe);

    // Execute
    const { result } = renderHook(() => useAuthStatus());

    // Verify initial state
    expect(result.current.checkingStatus).toBe(true);
    expect(result.current.loggedIn).toBe(false);
    expect(result.current.currentUser).toBeNull();
  });

  it('should set loggedIn to true when user is authenticated', async () => {
    // Setup
    const mockUser = { uid: '123', email: 'test@example.com' };
    (getAuth as Mock).mockReturnValue({});

    (onAuthStateChanged as Mock).mockImplementation(
      (_: unknown, callback: (user: typeof mockUser | null) => void) => {
        callback(mockUser);
        return () => {}; // Return a mock unsubscribe function
      }
    );

    // Execute
    const { result } = renderHook(() => useAuthStatus());

    // Verify
    await waitFor(() => {
      expect(result.current.checkingStatus).toBe(false);
      expect(result.current.loggedIn).toBe(true);
      expect(result.current.currentUser).toStrictEqual(mockUser);
    });
  });

  it('should set loggedIn to false and currentUser to null when user is not authenticated', async () => {
    // Setup
    (getAuth as Mock).mockReturnValue({});

    (onAuthStateChanged as Mock).mockImplementation(
      (_: unknown, callback: (user: null) => void) => {
        callback(null);
        return () => {}; // Return a mock unsubscribe function
      }
    );

    // Execute
    const { result } = renderHook(() => useAuthStatus());

    // Verify
    await waitFor(() => {
      expect(result.current.checkingStatus).toBe(false);
      expect(result.current.loggedIn).toBe(false);
      expect(result.current.currentUser).toBeNull();
    });
  });

  it('should call unsubscribe on unmount', () => {
    // Setup
    const mockAuth = {};
    const mockUnsubscribe = vi.fn();
    (getAuth as Mock).mockReturnValue(mockAuth);
    (onAuthStateChanged as Mock).mockReturnValue(mockUnsubscribe);

    // Execute
    const { unmount } = renderHook(() => useAuthStatus());
    unmount();

    // Verify
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
})