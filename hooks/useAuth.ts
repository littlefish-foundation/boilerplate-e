import { useState, useEffect, useCallback } from 'react'

interface User {
  walletAddress?: string
  email?: string
  walletNetwork?: number
  verifiedPolicy?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/session", { credentials: 'include' })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else if (res.status === 401) {
        // This is an expected state when the user is not logged in
        setUser(null)
      } else {
        console.error('Unexpected error during session check:', res.status, res.statusText)
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to check session:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const logout = async () => {
    try {
      const res = await fetch('/api/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      setUser(null)
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  };

  const refreshUser = useCallback(() => {
    setLoading(true)
    return checkSession()
  }, [checkSession])

  return { user, loading, logout, refreshUser }
}