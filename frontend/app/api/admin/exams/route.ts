import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const [exams]: any = await db.query(`
      SELECT 
        e.id,
        e.name,
        e.code,
        e.description,
        e.status,
        e.created_at,
        COUNT(DISTINCT es.subject_id) as subjects_count,
        COUNT(DISTINCT a.id) as assessments_count
      FROM exams e
      LEFT JOIN exam_subjects es ON e.id = es.exam_id
      LEFT JOIN assessments a ON e.id = a.exam_id
      GROUP BY e.id
      ORDER BY e.id ASC
    `)

    return NextResponse.json({ success: true, exams })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, code, description, status = 'active', subject_ids = [] } = body

    if (!name || !code) {
      return NextResponse.json({ success: false, error: 'Name and Code are required' }, { status: 400 })
    }

    const [result]: any = await db.query(
      `INSERT INTO exams (name, code, description, status, created_at) VALUES (?, ?, ?, ?, NOW())`,
      [name, code.toUpperCase().replace(/\s+/g, '_'), description || null, status]
    )

    const examId = result.insertId

    if (Array.isArray(subject_ids) && subject_ids.length > 0) {
      for (const subId of subject_ids) {
        await db.query(`INSERT IGNORE INTO exam_subjects (exam_id, subject_id) VALUES (?, ?)`, [examId, subId])
      }
    }

    return NextResponse.json({ success: true, examId, message: 'Exam created successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, code, description, status, subject_ids } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Exam ID is required' }, { status: 400 })
    }

    await db.query(
      `UPDATE exams SET name = ?, code = ?, description = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [name, code, description, status, id]
    )

    if (Array.isArray(subject_ids)) {
      await db.query(`DELETE FROM exam_subjects WHERE exam_id = ?`, [id])
      for (const subId of subject_ids) {
        await db.query(`INSERT IGNORE INTO exam_subjects (exam_id, subject_id) VALUES (?, ?)`, [id, subId])
      }
    }

    return NextResponse.json({ success: true, message: 'Exam updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Exam ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM exam_subjects WHERE exam_id = ?`, [id])
    await db.query(`DELETE FROM exams WHERE id = ?`, [id])

    return NextResponse.json({ success: true, message: 'Exam deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

