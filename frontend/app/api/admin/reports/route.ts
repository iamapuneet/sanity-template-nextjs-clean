import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    let query = `
      SELECT 
        r.id,
        r.student_id,
        r.question_id,
        r.report_type,
        r.description,
        r.status,
        r.reviewed_at,
        r.created_at,
        s.full_name as student_name,
        s.email as student_email,
        q.question_text,
        sub.name as subject_name
      FROM student_question_reports r
      JOIN students s ON r.student_id = s.id
      JOIN questions q ON r.question_id = q.id
      JOIN subjects sub ON q.subject_id = sub.id
    `
    const params: any[] = []

    if (status && status !== 'all') {
      query += ` WHERE r.status = ?`
      params.push(status)
    }

    query += ` ORDER BY r.id DESC`

    const [reports]: any = await db.query(query, params)

    return NextResponse.json({ success: true, reports })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, reviewed_by = 1 } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Report ID and status are required' }, { status: 400 })
    }

    await db.query(
      `UPDATE student_question_reports 
       SET status = ?, reviewed_by = ?, reviewed_at = NOW() 
       WHERE id = ?`,
      [status, reviewed_by, id]
    )

    return NextResponse.json({ success: true, message: `Report status updated to ${status}` })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { student_id = 1, question_id, report_type = 'wrong_answer', description } = body

    if (!question_id) {
      return NextResponse.json({ success: false, error: 'Question ID is required' }, { status: 400 })
    }

    const [result]: any = await db.query(
      `INSERT INTO student_question_reports (student_id, question_id, report_type, description, status, created_at)
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [student_id, question_id, report_type, description || null]
    )

    return NextResponse.json({ success: true, reportId: result.insertId, message: 'Report submitted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

