import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const [students]: any = await db.query(`SELECT id, full_name, email, username FROM students WHERE account_status = 'active' ORDER BY id ASC`)
    return NextResponse.json({ success: true, students })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email } = body

    if (!full_name) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 })
    }

    const uname = full_name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900)
    const userEmail = email || `${uname}@candidate.examforge.in`

    const [res]: any = await db.query(
      `INSERT INTO students (full_name, username, email, account_status, created_at)
       VALUES (?, ?, ?, 'active', NOW())
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
      [full_name, uname, userEmail]
    )

    const studentId = res.insertId || 1

    return NextResponse.json({
      success: true,
      student: { id: studentId, full_name, email: userEmail, username: uname },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
