import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    let whereClauses: string[] = []
    let params: any[] = []

    if (status && status !== 'all') {
      whereClauses.push('s.account_status = ?')
      params.push(status)
    }
    if (search && search.trim()) {
      whereClauses.push('(s.full_name LIKE ? OR s.email LIKE ? OR s.username LIKE ?)')
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`)
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const [students]: any = await db.query(
      `SELECT 
        s.id,
        s.full_name,
        s.username,
        s.email,
        s.mobile,
        s.account_status,
        s.state,
        s.district,
        s.last_login_at,
        s.created_at,
        COUNT(DISTINCT att.id) as attempts_count,
        AVG(att.percentage) as avg_score,
        AVG(att.accuracy) as avg_accuracy,
        MAX(att.submission_time) as last_attempt_at
      FROM students s
      LEFT JOIN assessment_attempts att ON s.id = att.student_id
      ${whereSql}
      GROUP BY s.id
      ORDER BY s.id DESC`,
      params
    )

    return NextResponse.json({ success: true, students })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, username, mobile, state = 'Rajasthan', district = 'Jaipur', account_status = 'active' } = body

    if (!full_name || !email) {
      return NextResponse.json({ success: false, error: 'Full name and email are required' }, { status: 400 })
    }

    const uname = username || email.split('@')[0] + Math.floor(Math.random() * 1000)

    const [result]: any = await db.query(
      `INSERT INTO students (full_name, username, email, mobile, state, district, account_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [full_name, uname, email, mobile || null, state, district, account_status]
    )

    return NextResponse.json({ success: true, studentId: result.insertId, message: 'Student registered successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, full_name, mobile, state, district, account_status } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 })
    }

    await db.query(
      `UPDATE students 
       SET full_name = COALESCE(?, full_name),
           mobile = COALESCE(?, mobile),
           state = COALESCE(?, state),
           district = COALESCE(?, district),
           account_status = COALESCE(?, account_status),
           updated_at = NOW()
       WHERE id = ?`,
      [full_name, mobile, state, district, account_status, id]
    )

    return NextResponse.json({ success: true, message: 'Student profile updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM students WHERE id = ?`, [id])

    return NextResponse.json({ success: true, message: 'Student deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

