import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const [[assessment]]: any = await db.query(
      `SELECT 
        a.id,
        a.title,
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
      WHERE a.id = ? AND a.status = 'published'`,
      [id]
    )

    if (!assessment) {
      return NextResponse.json({ success: false, error: 'Assessment not found' }, { status: 404 })
    }

    // Get linked questions
    const [questions]: any = await db.query(
      `SELECT 
        aq.id as assessment_question_id,
        aq.question_id,
        aq.order_index,
        aq.marks,
        aq.negative_marks,
        q.question_text,
        q.question_type,
        q.difficulty,
        q.language_code,
        s.name as subject_name,
        t.name as topic_name
      FROM assessment_questions aq
      JOIN questions q ON aq.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      JOIN topics t ON q.topic_id = t.id
      WHERE aq.assessment_id = ?
      ORDER BY aq.order_index ASC`,
      [id]
    )

    if (questions.length > 0) {
      const qIds = questions.map((q: any) => q.question_id)
      // Note: EXCLUDING is_correct for exam integrity!
      const [options]: any = await db.query(
        `SELECT id, question_id, option_key, option_text 
         FROM question_options 
         WHERE question_id IN (${qIds.map(() => '?').join(',')}) 
         ORDER BY order_index ASC`,
        qIds
      )

      const optMap: Record<number, any[]> = {}
      for (const opt of options) {
        if (!optMap[opt.question_id]) optMap[opt.question_id] = []
        optMap[opt.question_id].push({
          id: opt.id,
          key: opt.option_key,
          text: opt.option_text,
        })
      }

      for (const q of questions) {
        q.options = optMap[q.question_id] || []
      }
    }

    return NextResponse.json({
      success: true,
      assessment,
      questions,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
