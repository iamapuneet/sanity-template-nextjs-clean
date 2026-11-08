import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subject_id')
    const type = searchParams.get('type')

    let query = `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.description,
        a.assessment_type,
        a.duration_minutes,
        a.total_questions,
        a.total_marks,
        a.passing_percentage,
        s.name as subject_name,
        e.name as exam_name
      FROM assessments a
      LEFT JOIN subjects s ON a.subject_id = s.id
      LEFT JOIN exams e ON a.exam_id = e.id
      WHERE a.status = 'published'
    `
    const params: any[] = []

    if (subjectId && subjectId !== 'all') {
      query += ` AND a.subject_id = ?`
      params.push(subjectId)
    }

    if (type && type !== 'all') {
      query += ` AND a.assessment_type = ?`
      params.push(type)
    }

    query += ` ORDER BY a.id ASC`

    const [assessments]: any = await db.query(query, params)

    return NextResponse.json({ success: true, assessments })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

