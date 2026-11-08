import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    // 1. Core Summary Metrics
    const [[studentsRow]]: any = await db.query('SELECT COUNT(*) as count FROM students')
    const [[subjectsRow]]: any = await db.query('SELECT COUNT(*) as count FROM subjects WHERE status = "active"')
    const [[topicsRow]]: any = await db.query('SELECT COUNT(*) as count FROM topics')
    const [[questionsRow]]: any = await db.query('SELECT COUNT(*) as count FROM questions')
    const [[approvedRow]]: any = await db.query('SELECT COUNT(*) as count FROM questions WHERE status = "approved"')
    const [[pendingRow]]: any = await db.query('SELECT COUNT(*) as count FROM questions WHERE status = "pending"')
    const [[testsRow]]: any = await db.query('SELECT COUNT(*) as count FROM assessments')
    const [[attemptsRow]]: any = await db.query('SELECT COUNT(*) as count FROM assessment_attempts')
    const [[reportsRow]]: any = await db.query('SELECT COUNT(*) as count FROM student_question_reports WHERE status = "pending"')
    const [[avgScoreRow]]: any = await db.query('SELECT AVG(percentage) as avg_pct, AVG(accuracy) as avg_acc FROM assessment_attempts WHERE status = "submitted"')

    // 2. Subject-wise distribution
    const [subjectStats]: any = await db.query(`
      SELECT 
        s.id, 
        s.name, 
        s.code,
        COUNT(DISTINCT q.id) as question_count,
        SUM(CASE WHEN q.status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        COUNT(DISTINCT t.id) as topic_count
      FROM subjects s
      LEFT JOIN topics t ON s.id = t.subject_id
      LEFT JOIN questions q ON s.id = q.subject_id
      GROUP BY s.id
      ORDER BY question_count DESC
    `)

    // 3. Recent Questions
    const [recentQuestions]: any = await db.query(`
      SELECT 
        q.id,
        q.question_text,
        q.difficulty,
        q.status,
        q.language_code,
        s.name as subject_name,
        t.name as topic_name,
        q.created_at
      FROM questions q
      LEFT JOIN subjects s ON q.subject_id = s.id
      LEFT JOIN topics t ON q.topic_id = t.id
      ORDER BY q.id DESC
      LIMIT 6
    `)

    // 4. Recent Test Attempts & Performance
    const [recentAttempts]: any = await db.query(`
      SELECT 
        a.id,
        s.full_name as student_name,
        s.email as student_email,
        asm.title as assessment_title,
        a.obtained_marks,
        a.total_marks,
        a.percentage,
        a.accuracy,
        a.time_taken_seconds,
        a.passed,
        a.created_at
      FROM assessment_attempts a
      JOIN students s ON a.student_id = s.id
      JOIN assessments asm ON a.assessment_id = asm.id
      ORDER BY a.id DESC
      LIMIT 5
    `)

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: Number(studentsRow?.count || 0),
        totalSubjects: Number(subjectsRow?.count || 0),
        totalTopics: Number(topicsRow?.count || 0),
        totalQuestions: Number(questionsRow?.count || 0),
        approvedQuestions: Number(approvedRow?.count || 0),
        pendingQuestions: Number(pendingRow?.count || 0),
        totalMockTests: Number(testsRow?.count || 0),
        totalAttempts: Number(attemptsRow?.count || 0),
        pendingReports: Number(reportsRow?.count || 0),
        avgScore: Math.round(Number(avgScoreRow?.avg_pct || 0)),
        avgAccuracy: Math.round(Number(avgScoreRow?.avg_acc || 0)),
      },
      subjectStats,
      recentQuestions,
      recentAttempts,
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}
