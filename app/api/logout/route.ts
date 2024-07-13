import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        cookies().delete('auth-token')
        return NextResponse.json({ message: 'Logged out successfully' })
    } catch (error) {
        console.error('Error during logout:', error)
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
    }
}