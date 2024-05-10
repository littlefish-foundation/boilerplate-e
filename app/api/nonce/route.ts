import { randomBytes } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';


function generateNonce(): string {
    return randomBytes(16).toString('hex'); // Generate a 16-byte hex string
};

export default function GET(req: Request) {
    const nonce = generateNonce();
    const response = NextResponse.json({ nonce });
    // write the nonce to the response
    return response;
}