import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, logAudit } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth.response) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const subjectId = searchParams.get('subject_id')
    const topicId = searchParams.get('topic_id')
    const mainTopicId = searchParams.get('main_topic_id')

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
    if (difficulty && difficulty !== 'all') {
      whereClauses.push('LOWER(a.difficulty_level) = LOWER(?)')
      params.push(difficulty)
    }
    if (subjectId && subjectId !== 'all') {
      whereClauses.push('a.subject_id = ?')
      params.push(Number(subjectId))
    }
    if (topicId && topicId !== 'all') {
      whereClauses.push('a.topic_id = ?')
      params.push(Number(topicId))
    }
    if (mainTopicId && mainTopicId !== 'all') {
      whereClauses.push('(t.id = ? OR p1.id = ? OR p2.id = ?)')
      params.push(Number(mainTopicId), Number(mainTopicId), Number(mainTopicId))
    }
    if (search && search.trim()) {
      whereClauses.push('(a.title LIKE ? OR a.description LIKE ? OR t.name LIKE ? OR s.name LIKE ?)')
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`)
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
        COALESCE(a.difficulty_level, 'medium') as difficulty_level,
        a.status,
        a.created_at,
        e.name as exam_name,
        s.name as subject_name,
        s.code as subject_code,
        t.name as topic_name,
        COALESCE(
          CASE WHEN t.level = 1 THEN t.id WHEN p1.level = 1 THEN p1.id ELSE p2.id END,
          t.id
        ) as main_topic_id,
        COALESCE(
          CASE WHEN t.level = 1 THEN t.name WHEN p1.level = 1 THEN p1.name ELSE p2.name END,
          t.name,
          'Full Syllabus / Mixed Drill'
        ) as main_topic_name,
        COUNT(DISTINCT aq.question_id) as actual_question_count,
        COUNT(DISTINCT att.id) as attempts_count,
        COUNT(DISTINCT mta.student_id) as assigned_students_count,
        AVG(att.percentage) as avg_score
      FROM assessments a
      LEFT JOIN exams e ON a.exam_id = e.id
      LEFT JOIN subjects s ON a.subject_id = s.id
      LEFT JOIN topics t ON a.topic_id = t.id
      LEFT JOIN topics p1 ON t.parent_id = p1.id
      LEFT JOIN topics p2 ON p1.parent_id = p2.id
      LEFT JOIN assessment_questions aq ON a.id = aq.assessment_id
      LEFT JOIN assessment_attempts att ON a.id = att.assessment_id
      LEFT JOIN mock_test_assignments mta ON a.id = mta.mock_test_id AND mta.assignment_status = 'assigned'
      ${whereSql}
      GROUP BY a.id, a.title, a.slug, a.description, a.exam_id, a.subject_id, a.topic_id, a.assessment_type, a.duration_minutes, a.total_questions, a.total_marks, a.passing_percentage, a.difficulty_level, a.status, a.created_at, e.name, s.id, s.name, s.code, t.name, t.id, t.level, p1.id, p1.name, p1.level, p2.id, p2.name
      ORDER BY s.id ASC, main_topic_name ASC, a.id DESC`,
      params
    )

    return NextResponse.json({ success: true, tests })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth.response) return auth.response

  try {
    const body = await req.json()
    const {
      title,
      description,
      exam_id = 1,
      subject_id = null,
      topic_id = null,
      assessment_type = 'mock',
      difficulty_level = 'medium',
      duration_minutes = 60,
      passing_percentage = 40.0,
      status = 'published',
      selected_question_ids = [],
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
       (title, slug, description, exam_id, subject_id, topic_id, assessment_type, difficulty_level, duration_minutes, total_questions, total_marks, passing_percentage, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        slug,
        description || null,
        exam_id || null,
        subject_id || null,
        topic_id || null,
        assessment_type,
        difficulty_level || 'medium',
        duration_minutes,
        total_questions,
        total_marks,
        passing_percentage,
        status,
      ]
    )

    const assessmentId = res.insertId

    // Insert linked questions
    if (selected_question_ids && selected_question_ids.length > 0) {
      for (let i = 0; i < selected_question_ids.length; i++) {
        const qId = selected_question_ids[i]
        await db.query(
          `INSERT INTO assessment_questions 
           (assessment_id, question_id, order_index, marks, negative_marks)
           VALUES (?, ?, ?, ?, ?)`,
          [assessmentId, qId, i + 1, marks_per_question, negative_marks_per_question]
        )
      }
    }

    await logAudit({
      actorId: auth.user.id,
      actorRole: 'admin',
      action: 'MOCK_TEST_CREATED',
      targetId: assessmentId,
      targetType: 'assessment',
      details: { title, total_questions, assessment_type },
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    })

    return NextResponse.json({
      success: true,
      assessmentId,
      message: 'Assessment created successfully',
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth.response) return auth.response

  try {
    const body = await req.json()
    const {
      id,
      title,
      description,
      subject_id,
      topic_id,
      assessment_type,
      difficulty_level,
      duration_minutes,
      passing_percentage,
      status,
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Test ID is required' }, { status: 400 })
    }

    await db.query(
      `UPDATE assessments 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           subject_id = COALESCE(?, subject_id),
           topic_id = COALESCE(?, topic_id),
           assessment_type = COALESCE(?, assessment_type),
           difficulty_level = COALESCE(?, difficulty_level),
           duration_minutes = COALESCE(?, duration_minutes),
           passing_percentage = COALESCE(?, passing_percentage),
           status = COALESCE(?, status),
           updated_at = NOW()
       WHERE id = ?`,
      [
        title || null,
        description || null,
        subject_id !== undefined ? (subject_id ? Number(subject_id) : null) : null,
        topic_id !== undefined ? (topic_id ? Number(topic_id) : null) : null,
        assessment_type || null,
        difficulty_level || null,
        duration_minutes ? Number(duration_minutes) : null,
        passing_percentage ? Number(passing_percentage) : null,
        status || null,
        Number(id),
      ]
    )

    await logAudit({
      actorId: auth.user.id,
      actorRole: 'admin',
      action: 'MOCK_TEST_UPDATED',
      targetId: Number(id),
      targetType: 'assessment',
      details: { title, subject_id, topic_id, status },
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    })

    return NextResponse.json({ success: true, message: 'Mock test updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth.response) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM assessment_questions WHERE assessment_id = ?`, [id])
    await db.query(`DELETE FROM mock_test_assignments WHERE mock_test_id = ?`, [id])
    await db.query(`DELETE FROM assessments WHERE id = ?`, [id])

    await logAudit({
      actorId: auth.user.id,
      actorRole: 'admin',
      action: 'MOCK_TEST_DELETED',
      targetId: Number(id),
      targetType: 'assessment',
      ipAddress: req.headers.get('x-forwarded-for') || null,
      userAgent: req.headers.get('user-agent') || null,
    })

    return NextResponse.json({ success: true, message: 'Assessment deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
