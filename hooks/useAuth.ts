import { cookies } from 'next/headers'
import { useState, useEffect } from 'react'

interface User {
  walletAddress?: string
  email?: string
  walletNetwork?: number
  verifiedPolicy?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/session', { credentials: 'include' })
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to check session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const logout = async () => {
    try {
      // Remove JWT token from cookies
      cookies().delete('auth-token')
      setUser(null); // Clear user state
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return { user, loading, logout}
}