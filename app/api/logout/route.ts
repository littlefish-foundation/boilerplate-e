import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function getCookies() {
    try {
        return cookies();
    } catch (error) {
        console.error('Failed to access cookies:', error);
        return null;
    }
}

export async function POST() {
    const cookiesObj = getCookies();
    if (!cookiesObj) {
        return NextResponse.json({ error: "Cookie access blocked" }, { status: 403 });
    }

    try {
        const authToken = cookiesObj.get('auth-token');
        if (!authToken) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        cookiesObj.delete('auth-token');
        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
}