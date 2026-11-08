import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const attemptId = searchParams.get('attempt_id')

    if (attemptId) {
      // Return granular attempt detail with question-by-question time tracking
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
          s.email as student_email,
          asm.title as assessment_title,
          asm.duration_minutes
        FROM assessment_attempts att
        JOIN students s ON att.student_id = s.id
        JOIN assessments asm ON att.assessment_id = asm.id
        WHERE att.id = ?`,
        [attemptId]
      )

      if (!attempt) {
        return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 })
      }

      // Fetch per-question answers with time_spent_seconds
      const [answers]: any = await db.query(
        `SELECT 
          aa.id as answer_id,
          aa.attempt_question_id,
          aa.selected_option_key,
          aa.is_correct,
          aa.marks_awarded,
          aa.time_spent_seconds,
          aa.answer_status,
          aa.last_answered_at,
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
        [attemptId]
      )

      // Fetch options for these questions
      if (answers.length > 0) {
        const questionIds = answers.map((a: any) => a.question_id)
        const [options]: any = await db.query(
          `SELECT question_id, option_key, option_text, is_correct FROM question_options WHERE question_id IN (${questionIds.map(() => '?').join(',')}) ORDER BY order_index ASC`,
          questionIds
        )

        const optionsMap: Record<number, any[]> = {}
        for (const opt of options) {
          if (!optionsMap[opt.question_id]) optionsMap[opt.question_id] = []
          optionsMap[opt.question_id].push({
            key: opt.option_key,
            text: opt.option_text,
            isCorrect: Boolean(opt.is_correct),
          })
        }

        for (const a of answers) {
          a.options = optionsMap[a.question_id] || []
          const correctOpt = a.options.find((o: any) => o.isCorrect)
          a.correct_option_key = correctOpt ? correctOpt.key : null
        }
      }

      return NextResponse.json({
        success: true,
        attempt,
        answers,
      })
    }

    // Default: List all attempts
    const [attempts]: any = await db.query(`
      SELECT 
        att.id,
        att.student_id,
        att.assessment_id,
        att.status,
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
        att.submission_time,
        att.created_at,
        s.full_name as student_name,
        s.email as student_email,
        asm.title as assessment_title,
        asm.assessment_type
      FROM assessment_attempts att
      JOIN students s ON att.student_id = s.id
      JOIN assessments asm ON att.assessment_id = asm.id
      ORDER BY att.id DESC
      LIMIT 100
    `)

    // Leaderboard / Rankings
    const [rankings]: any = await db.query(`
      SELECT 
        s.id as student_id,
        s.full_name,
        COUNT(att.id) as tests_taken,
        AVG(att.percentage) as avg_percentage,
        AVG(att.accuracy) as avg_accuracy,
        MAX(att.obtained_marks) as highest_score
      FROM students s
      JOIN assessment_attempts att ON s.id = att.student_id
      WHERE att.status = 'submitted'
      GROUP BY s.id
      ORDER BY avg_percentage DESC, avg_accuracy DESC
      LIMIT 10
    `)

    return NextResponse.json({
      success: true,
      attempts,
      rankings,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

