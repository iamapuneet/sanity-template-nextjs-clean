import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const [[attempt]]: any = await db.query(
      `SELECT 
        att.id,
        att.student_id,
        att.assessment_id,
        att.status,
        att.start_time,
        att.submission_time,
        att.total_questions,
        att.attempted_questions,
        att.correct_answers,
        att.incorrect_answers,
        att.unanswered_questions,
        att.obtained_marks,
        att.total_marks,
        att.percentage,
        att.accuracy,
        att.time_taken_seconds,
        att.passed,
        s.full_name as student_name,
        asm.title as assessment_title,
        asm.duration_minutes,
        asm.passing_percentage
      FROM assessment_attempts att
      JOIN students s ON att.student_id = s.id
      JOIN assessments asm ON att.assessment_id = asm.id
      WHERE att.id = ?`,
      [id]
    )

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 })
    }

    // Fetch answers with time_spent_seconds, questions, and explanations
    const [answers]: any = await db.query(
      `SELECT 
        aa.id as answer_id,
        aa.selected_option_key,
        aa.is_correct,
        aa.marks_awarded,
        aa.time_spent_seconds,
        aa.answer_status,
        q.id as question_id,
        q.question_text,
        q.explanation,
        q.difficulty,
        sub.name as subject_name,
        top.name as topic_name,
        aaq.order_index,
        aaq.marks as max_marks,
        aaq.negative_marks
      FROM attempt_answers aa
      JOIN assessment_attempt_questions aaq ON aa.attempt_question_id = aaq.id
      JOIN questions q ON aaq.question_id = q.id
      JOIN subjects sub ON q.subject_id = sub.id
      JOIN topics top ON q.topic_id = top.id
      WHERE aa.attempt_id = ?
      ORDER BY aaq.order_index ASC`,
      [id]
    )

    if (answers.length > 0) {
      const qIds = answers.map((a: any) => a.question_id)
      const [options]: any = await db.query(
        `SELECT question_id, option_key, option_text, is_correct 
         FROM question_options 
         WHERE question_id IN (${qIds.map(() => '?').join(',')}) 
         ORDER BY order_index ASC`,
        qIds
      )

      const optMap: Record<number, any[]> = {}
      for (const opt of options) {
        if (!optMap[opt.question_id]) optMap[opt.question_id] = []
        optMap[opt.question_id].push({
          key: opt.option_key,
          text: opt.option_text,
          isCorrect: Boolean(opt.is_correct),
        })
      }

      for (const a of answers) {
        a.options = optMap[a.question_id] || []
        const correctOpt = a.options.find((o: any) => o.isCorrect)
        a.correct_option_key = correctOpt ? correctOpt.key : null
      }
    }

    return NextResponse.json({
      success: true,
      attempt,
      answers,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

