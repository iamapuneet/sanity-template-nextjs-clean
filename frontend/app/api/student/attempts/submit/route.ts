import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { attempt_id, answers = [], time_taken_seconds = 0 } = body

    if (!attempt_id) {
      return NextResponse.json({ success: false, error: 'Attempt ID is required' }, { status: 400 })
    }

    // Get attempt & assessment info
    const [[attempt]]: any = await db.query(
      `SELECT a.id, a.assessment_id, a.student_id, asm.passing_percentage, asm.total_marks
       FROM assessment_attempts a
       JOIN assessments asm ON a.assessment_id = asm.id
       WHERE a.id = ?`,
      [attempt_id]
    )

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt record not found' }, { status: 404 })
    }

    // Get all questions snapshotted for this attempt
    const [attemptQuestions]: any = await db.query(
      `SELECT id, question_id, order_index, marks, negative_marks 
       FROM assessment_attempt_questions 
       WHERE attempt_id = ?`,
      [attempt_id]
    )

    // Get correct answers for all questions
    const questionIds = attemptQuestions.map((q: any) => q.question_id)
    const [correctOptions]: any = await db.query(
      `SELECT question_id, option_key 
       FROM question_options 
       WHERE question_id IN (${questionIds.map(() => '?').join(',')}) AND is_correct = 1`,
      questionIds
    )

    const correctKeyMap: Record<number, string> = {}
    for (const opt of correctOptions) {
      correctKeyMap[opt.question_id] = opt.option_key
    }

    // Index answers sent from client by question_id
    const clientAnswersMap: Record<number, { selected_option_key?: string; answer_status?: string; time_spent_seconds?: number }> = {}
    if (Array.isArray(answers)) {
      for (const a of answers) {
        clientAnswersMap[Number(a.question_id)] = a
      }
    }

    let attempted_questions = 0
    let correct_answers = 0
    let incorrect_answers = 0
    let unanswered_questions = 0
    let positive_marks = 0
    let negative_marks = 0

    // Process each question
    for (const aq of attemptQuestions) {
      const qId = Number(aq.question_id)
      const clientAns = clientAnswersMap[qId]
      const selectedKey = clientAns?.selected_option_key || null
      const rawStatus = clientAns?.answer_status || (selectedKey ? 'answered' : 'unanswered')
      const timeSpent = Math.max(0, Number(clientAns?.time_spent_seconds || 0))

      let is_correct: number | null = null
      let marks_awarded = 0
      let answer_status = rawStatus

      if (selectedKey) {
        attempted_questions++
        const expectedKey = correctKeyMap[qId]
        if (expectedKey && selectedKey.toUpperCase() === expectedKey.toUpperCase()) {
          is_correct = 1
          marks_awarded = Number(aq.marks)
          positive_marks += marks_awarded
          correct_answers++
        } else {
          is_correct = 0
          marks_awarded = -Number(aq.negative_marks)
          negative_marks += Number(aq.negative_marks)
          incorrect_answers++
        }
      } else {
        unanswered_questions++
        is_correct = null
        marks_awarded = 0
      }

      // Record in attempt_answers with time_spent_seconds
      await db.query(
        `INSERT INTO attempt_answers 
         (attempt_id, attempt_question_id, answer_status, selected_option_key, is_correct, marks_awarded, time_spent_seconds, last_answered_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE 
           answer_status = VALUES(answer_status),
           selected_option_key = VALUES(selected_option_key),
           is_correct = VALUES(is_correct),
           marks_awarded = VALUES(marks_awarded),
           time_spent_seconds = VALUES(time_spent_seconds),
           last_answered_at = NOW()`,
        [attempt_id, aq.id, answer_status, selectedKey, is_correct, marks_awarded, timeSpent]
      )
    }

    const total_questions = attemptQuestions.length
    const total_marks = attemptQuestions.reduce((acc: number, q: any) => acc + Number(q.marks), 0)
    const obtained_marks = Math.max(0, positive_marks - negative_marks)
    const percentage = total_marks > 0 ? (obtained_marks / total_marks) * 100 : 0
    const accuracy = attempted_questions > 0 ? (correct_answers / attempted_questions) * 100 : 0
    const passed = percentage >= Number(attempt.passing_percentage || 40) ? 1 : 0

    // Update assessment_attempts
    await db.query(
      `UPDATE assessment_attempts
       SET status = 'submitted',
           end_time = NOW(),
           submission_time = NOW(),
           total_questions = ?,
           attempted_questions = ?,
           correct_answers = ?,
           incorrect_answers = ?,
           unanswered_questions = ?,
           obtained_marks = ?,
           total_marks = ?,
           percentage = ?,
           accuracy = ?,
           time_taken_seconds = ?,
           passed = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        total_questions,
        attempted_questions,
        correct_answers,
        incorrect_answers,
        unanswered_questions,
        obtained_marks,
        total_marks,
        percentage,
        accuracy,
        time_taken_seconds,
        passed,
        attempt_id,
      ]
    )

    // Insert or update attempt_results
    await db.query(
      `INSERT INTO attempt_results 
       (attempt_id, total_questions, attempted_questions, correct_answers, incorrect_answers, unanswered_questions, positive_marks, negative_marks, obtained_marks, total_marks, percentage, accuracy, passed, calculated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         total_questions = VALUES(total_questions),
         attempted_questions = VALUES(attempted_questions),
         correct_answers = VALUES(correct_answers),
         incorrect_answers = VALUES(incorrect_answers),
         unanswered_questions = VALUES(unanswered_questions),
         positive_marks = VALUES(positive_marks),
         negative_marks = VALUES(negative_marks),
         obtained_marks = VALUES(obtained_marks),
         total_marks = VALUES(total_marks),
         percentage = VALUES(percentage),
         accuracy = VALUES(accuracy),
         passed = VALUES(passed)`,
      [
        attempt_id,
        total_questions,
        attempted_questions,
        correct_answers,
        incorrect_answers,
        unanswered_questions,
        positive_marks,
        negative_marks,
        obtained_marks,
        total_marks,
        percentage,
        accuracy,
        passed,
      ]
    )

    return NextResponse.json({
      success: true,
      attemptId: attempt_id,
      score: {
        total_questions,
        attempted_questions,
        correct_answers,
        incorrect_answers,
        unanswered_questions,
        positive_marks,
        negative_marks,
        obtained_marks,
        total_marks,
        percentage: Number(percentage.toFixed(2)),
        accuracy: Number(accuracy.toFixed(2)),
        time_taken_seconds,
        passed: Boolean(passed),
      },
    })
  } catch (error: any) {
    console.error('Error submitting attempt:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
