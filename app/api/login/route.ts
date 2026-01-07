import { NextResponse } from 'next/server'
import jwt from "jsonwebtoken"

const EMAILS = process.env.WHITELISTED_EMAILS!
const PASSWORD = process.env.WHITELISTED_PASSWORD!
const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  const { email, password } = await req.json()
 

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (!EMAILS.includes(email) || password !== PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })

  // console.log("Login token", token)
  const response = NextResponse.json({ success: true })

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60
  })

  return response
}
