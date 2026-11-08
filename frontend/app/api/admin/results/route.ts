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
      WHERE att.status = 'submitted'
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

    // Aggregated Accuracy Breakdown (for Pie / Donut Chart)
    const [[accuracyRow]]: any = await db.query(`
      SELECT 
        COALESCE(SUM(correct_answers), 0) as total_correct,
        COALESCE(SUM(incorrect_answers), 0) as total_incorrect,
        COALESCE(SUM(unanswered_questions), 0) as total_unanswered,
        COALESCE(SUM(total_questions), 0) as total_questions_served
      FROM assessment_attempts
      WHERE status = 'submitted'
    `)

    // Speed Distribution (for Pie / Donut Chart: Fast vs Moderate vs Slow)
    const [[speedRow]]: any = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN time_spent_seconds > 0 AND time_spent_seconds < 20 THEN 1 ELSE 0 END), 0) as fast_count,
        COALESCE(SUM(CASE WHEN time_spent_seconds >= 20 AND time_spent_seconds <= 45 THEN 1 ELSE 0 END), 0) as moderate_count,
        COALESCE(SUM(CASE WHEN time_spent_seconds > 45 THEN 1 ELSE 0 END), 0) as heavy_count,
        COALESCE(AVG(time_spent_seconds), 0) as avg_time_per_question
      FROM attempt_answers
    `)

    // Topic-wise Performance Bars
    const [topicPerformance]: any = await db.query(`
      SELECT 
        top.name as topic_name,
        sub.name as subject_name,
        COUNT(aa.id) as total_attempts,
        COALESCE(SUM(CASE WHEN aa.is_correct = 1 THEN 1 ELSE 0 END), 0) as correct_count,
        ROUND((COALESCE(SUM(CASE WHEN aa.is_correct = 1 THEN 1 ELSE 0 END), 0) / COUNT(aa.id)) * 100) as accuracy_pct,
        ROUND(AVG(aa.time_spent_seconds)) as avg_seconds
      FROM attempt_answers aa
      JOIN assessment_attempt_questions aaq ON aa.attempt_question_id = aaq.id
      JOIN questions q ON aaq.question_id = q.id
      JOIN topics top ON q.topic_id = top.id
      JOIN subjects sub ON q.subject_id = sub.id
      GROUP BY top.id
      ORDER BY total_attempts DESC
      LIMIT 8
    `)

    return NextResponse.json({
      success: true,
      attempts,
      rankings,
      analytics: {
        accuracyBreakdown: {
          correct: Number(accuracyRow?.total_correct || 0),
          incorrect: Number(accuracyRow?.total_incorrect || 0),
          unanswered: Number(accuracyRow?.total_unanswered || 0),
          total: Number(accuracyRow?.total_questions_served || 0),
        },
        speedBreakdown: {
          fast: Number(speedRow?.fast_count || 0),
          moderate: Number(speedRow?.moderate_count || 0),
          heavy: Number(speedRow?.heavy_count || 0),
          avgSeconds: Math.round(Number(speedRow?.avg_time_per_question || 0)),
        },
        topicPerformance,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const attemptId = searchParams.get('attempt_id')

    if (!attemptId) {
      return NextResponse.json({ success: false, error: 'Attempt ID is required' }, { status: 400 })
    }

    await db.query('DELETE FROM attempt_answers WHERE attempt_id = ?', [attemptId])
    await db.query('DELETE FROM attempt_results WHERE attempt_id = ?', [attemptId])
    await db.query('DELETE FROM assessment_attempt_questions WHERE attempt_id = ?', [attemptId])
    await db.query('DELETE FROM assessment_attempts WHERE id = ?', [attemptId])

    return NextResponse.json({ success: true, message: 'Attempt removed successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
