"use client"
import { useAuth } from '../../hooks/useAuth'

const SessionChecker = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className='mt-16'>Loading...</div>
  }

  if (!user) {
    return <div className='mt-16'>You are not logged in</div>
  }

  return (
    <div className='mt-16'>
      <p>Logged in as {user.walletAddress || user.email}</p>
      {user.walletNetwork && <p>Wallet Network: {user.walletNetwork}</p>}
      {user.verifiedPolicy && <p>Verified Policy: {user.verifiedPolicy}</p>}
    </div>
  )
}

export default SessionChecker