import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { student_id = 1, assessment_id } = body

    if (!assessment_id) {
      return NextResponse.json({ success: false, error: 'Assessment ID is required' }, { status: 400 })
    }

    // Validate student existence and active status
    const [[student]]: any = await db.query(
      `SELECT id, full_name, status FROM students WHERE id = ?`,
      [student_id]
    )

    if (!student || student.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Valid candidate session required to start exam' },
        { status: 403 }
      )
    }

    const [[assessment]]: any = await db.query(
      `SELECT id, total_questions, total_marks, duration_minutes FROM assessments WHERE id = ?`,
      [assessment_id]
    )

    if (!assessment) {
      return NextResponse.json({ success: false, error: 'Assessment not found' }, { status: 404 })
    }

    // Determine attempt number for this student & assessment
    const [[attemptCountRow]]: any = await db.query(
      `SELECT COUNT(*) as cnt FROM assessment_attempts WHERE student_id = ? AND assessment_id = ?`,
      [student_id, assessment_id]
    )
    const attempt_number = Number(attemptCountRow?.cnt || 0) + 1

    // Insert into assessment_attempts
    const [attRes]: any = await db.query(
      `INSERT INTO assessment_attempts 
       (student_id, assessment_id, attempt_number, status, start_time, total_questions, total_marks, created_at)
       VALUES (?, ?, ?, 'in_progress', NOW(), ?, ?, NOW())`,
      [student_id, assessment_id, attempt_number, assessment.total_questions || 0, assessment.total_marks || 0]
    )

    const attemptId = attRes.insertId

    // Snapshot questions into assessment_attempt_questions
    const [aqList]: any = await db.query(
      `SELECT aq.question_id, aq.order_index, aq.marks, aq.negative_marks, q.question_text
       FROM assessment_questions aq
       JOIN questions q ON aq.question_id = q.id
       WHERE aq.assessment_id = ?
       ORDER BY aq.order_index ASC`,
      [assessment_id]
    )

    const questionMap: Record<number, number> = {} // maps question_id to assessment_attempt_questions.id

    for (const item of aqList) {
      const snapshot = JSON.stringify({ question_id: item.question_id, text: item.question_text })
      const [snapRes]: any = await db.query(
        `INSERT INTO assessment_attempt_questions 
         (attempt_id, question_id, question_version, order_index, marks, negative_marks, question_snapshot, created_at)
         VALUES (?, ?, 1, ?, ?, ?, ?, NOW())`,
        [attemptId, item.question_id, item.order_index, item.marks, item.negative_marks, snapshot]
      )
      questionMap[item.question_id] = snapRes.insertId
    }

    return NextResponse.json({
      success: true,
      attemptId,
      questionMap,
      durationMinutes: assessment.duration_minutes,
      message: 'Attempt initialized successfully',
    })
  } catch (error: any) {
    console.error('Error starting attempt:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

