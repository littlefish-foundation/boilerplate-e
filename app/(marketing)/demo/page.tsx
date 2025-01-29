"use server"
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { redirect } from 'next/navigation'
import DemoPage from './demoPage'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    redirect('/login')
    return null
  }

  // Decode and verify the JWT token
  try {
    const { payload } = await jose.jwtVerify(token.value, JWT_SECRET)
    const userRoles = payload.roles as string[] || []

    // Pass the user roles as a prop to DemoPage
    return (
      <DemoPage userRoles={userRoles} />
    )
  } catch (error) {
    console.error('Error verifying token:', error)
    redirect('/login')
    return null
  }
}