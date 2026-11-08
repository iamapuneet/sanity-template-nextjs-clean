import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let whereClauses: string[] = []
    let params: any[] = []

    if (type && type !== 'all') {
      whereClauses.push('a.assessment_type = ?')
      params.push(type)
    }
    if (status && status !== 'all') {
      whereClauses.push('a.status = ?')
      params.push(status)
    }
    if (search && search.trim()) {
      whereClauses.push('(a.title LIKE ? OR a.description LIKE ?)')
      params.push(`%${search.trim()}%`, `%${search.trim()}%`)
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const [tests]: any = await db.query(
      `SELECT 
        a.id,
        a.title,
        a.slug,
        a.description,
        a.exam_id,
        a.subject_id,
        a.topic_id,
        a.assessment_type,
        a.duration_minutes,
        a.total_questions,
        a.total_marks,
        a.passing_percentage,
        a.status,
        a.created_at,
        e.name as exam_name,
        s.name as subject_name,
        COUNT(DISTINCT aq.question_id) as actual_question_count,
        COUNT(DISTINCT att.id) as attempts_count,
        AVG(att.percentage) as avg_score
      FROM assessments a
      LEFT JOIN exams e ON a.exam_id = e.id
      LEFT JOIN subjects s ON a.subject_id = s.id
      LEFT JOIN assessment_questions aq ON a.id = aq.assessment_id
      LEFT JOIN assessment_attempts att ON a.id = att.assessment_id
      ${whereSql}
      GROUP BY a.id
      ORDER BY a.id DESC`,
      params
    )

    return NextResponse.json({ success: true, tests })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      exam_id = 1,
      subject_id = null,
      topic_id = null,
      assessment_type = 'mock',
      duration_minutes = 60,
      passing_percentage = 40.0,
      status = 'published',
      selected_question_ids = [], // [id1, id2, ...]
      marks_per_question = 1.0,
      negative_marks_per_question = 0.25,
    } = body

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now()}`
    const total_questions = Array.isArray(selected_question_ids) ? selected_question_ids.length : 0
    const total_marks = total_questions * Number(marks_per_question)

    const [res]: any = await db.query(
      `INSERT INTO assessments 
       (title, slug, description, exam_id, subject_id, topic_id, assessment_type, duration_minutes, total_questions, total_marks, passing_percentage, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        slug,
        description || null,
        exam_id || null,
        subject_id || null,
        topic_id || null,
        assessment_type,
        duration_minutes,
        total_questions,
        total_marks,
        passing_percentage,
        status,
      ]
    )

    const assessmentId = res.insertId

    if (Array.isArray(selected_question_ids) && selected_question_ids.length > 0) {
      for (let i = 0; i < selected_question_ids.length; i++) {
        await db.query(
          `INSERT INTO assessment_questions (assessment_id, question_id, order_index, marks, negative_marks)
           VALUES (?, ?, ?, ?, ?)`,
          [assessmentId, selected_question_ids[i], i + 1, marks_per_question, negative_marks_per_question]
        )
      }
    }

    return NextResponse.json({ success: true, assessmentId, message: 'Assessment created successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      title,
      description,
      assessment_type,
      duration_minutes,
      passing_percentage,
      status,
      selected_question_ids,
      marks_per_question = 1.0,
      negative_marks_per_question = 0.25,
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Assessment ID is required' }, { status: 400 })
    }

    const total_questions = Array.isArray(selected_question_ids) ? selected_question_ids.length : undefined
    const total_marks = total_questions !== undefined ? total_questions * Number(marks_per_question) : undefined

    await db.query(
      `UPDATE assessments
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           assessment_type = COALESCE(?, assessment_type),
           duration_minutes = COALESCE(?, duration_minutes),
           total_questions = COALESCE(?, total_questions),
           total_marks = COALESCE(?, total_marks),
           passing_percentage = COALESCE(?, passing_percentage),
           status = COALESCE(?, status),
           updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        description,
        assessment_type,
        duration_minutes,
        total_questions,
        total_marks,
        passing_percentage,
        status,
        id,
      ]
    )

    if (Array.isArray(selected_question_ids)) {
      await db.query(`DELETE FROM assessment_questions WHERE assessment_id = ?`, [id])
      for (let i = 0; i < selected_question_ids.length; i++) {
        await db.query(
          `INSERT INTO assessment_questions (assessment_id, question_id, order_index, marks, negative_marks)
           VALUES (?, ?, ?, ?, ?)`,
          [id, selected_question_ids[i], i + 1, marks_per_question, negative_marks_per_question]
        )
      }
    }

    return NextResponse.json({ success: true, message: 'Assessment updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Assessment ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM assessment_questions WHERE assessment_id = ?`, [id])
    await db.query(`DELETE FROM assessments WHERE id = ?`, [id])

    return NextResponse.json({ success: true, message: 'Assessment deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
