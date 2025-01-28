"use server"

import { cookies } from 'next/headers'
import * as jose from 'jose'
import { notFound } from 'next/navigation'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

async function verifyReviewerAccess() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return false
  }

  try {
    const { payload } = await jose.jwtVerify(token.value, JWT_SECRET)
    const userRoles = payload.roles as string[] || []
    return userRoles.includes('reviewer')
  } catch (error) {
    console.error('Error verifying token:', error)
    return false
  }
}

export default async function ReviewerPage() {
  const hasAccess = await verifyReviewerAccess()

  if (!hasAccess) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Reviewer Access Only
      </h1>

      <div className="p-6 rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-4">
          <p className="text-lg">
            Welcome to the reviewer-only demo page. This content is only visible
            to users with the reviewer role.
          </p>

          <div className="mt-6 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">
              Reviewer Specific Information
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access to reviewer page</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}