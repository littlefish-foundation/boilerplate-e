"use server"
import { cookies } from 'next/headers'
import * as jose from 'jose'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import TokenGatedDemoPage from './asset1page'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

interface Policy {
  id: string;
  policyID: string;
  createdAt: string;
  updatedAt: string;
}

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    redirect('/login')
    return null // This line is necessary to satisfy TypeScript
  }

  const response = await fetch(`${process.env.ROOT_URL}/api/policy`);
  if (!response.ok) {
    throw new Error(`Failed to fetch policies: ${response.statusText}`);
  }
  const data: Policy[] = await response.json();
  const formattedData = data.map(policy => ({
    ...policy,
    createdAt: new Date(policy.createdAt),
    updatedAt: new Date(policy.updatedAt)
  }));

  return (
    <TokenGatedDemoPage policies={formattedData} />
  )
}
