"use server"
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import SettingsPage from './settingsPage'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    redirect('/login')
  }

  let payload;
  try {
    ({ payload } = await jose.jwtVerify(token.value, JWT_SECRET))
  } catch (error) {
    redirect('/login')
  }

  // ... (keep other existing code)

  const userData = {
    id: payload.id, // Make sure the JWT payload includes the user's ID
    walletAddress: payload.walletAddress,
    email: payload.email,
    walletNetwork: payload.walletNetwork,
    verifiedPolicy: payload.verifiedPolicy,
  }

  if ("admin" !== userData.verifiedPolicy) {
    redirect('/')
  }
  
  return (
    <SettingsPage currentUserId={userData.id} />
  )
}
