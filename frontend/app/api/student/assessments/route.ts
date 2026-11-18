import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { authenticateUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to view mock tests', code: 'UNAUTHENTICATED' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subject_id')
    const topicId = searchParams.get('topic_id')
    const mainTopicId = searchParams.get('main_topic_id')
    const type = searchParams.get('type')
    const difficulty = searchParams.get('difficulty')

    let query: string
    const params: any[] = []

    if (user.role === 'admin') {
      // Admin can preview all published assessments
      query = `
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
          COALESCE(a.difficulty_level, 'medium') as difficulty_level,
          a.subject_id,
          a.topic_id,
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
            'General Mock Tests'
          ) as main_topic_name,
          e.name as exam_name,
          'assigned' as assignment_status
        FROM assessments a
        LEFT JOIN subjects s ON a.subject_id = s.id
        LEFT JOIN topics t ON a.topic_id = t.id
        LEFT JOIN topics p1 ON t.parent_id = p1.id
        LEFT JOIN topics p2 ON p1.parent_id = p2.id
        LEFT JOIN exams e ON a.exam_id = e.id
        WHERE a.status = 'published'
      `
    } else {
      // Student can ONLY see mock tests specifically assigned to them
      query = `
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
          COALESCE(a.difficulty_level, 'medium') as difficulty_level,
          a.subject_id,
          a.topic_id,
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
            'General Mock Tests'
          ) as main_topic_name,
          e.name as exam_name,
          mta.assignment_status,
          mta.assigned_at,
          (
            SELECT att.status 
            FROM assessment_attempts att 
            WHERE att.student_id = ? AND att.assessment_id = a.id 
            ORDER BY att.id DESC LIMIT 1
          ) as attempt_status,
          (
            SELECT att.percentage 
            FROM assessment_attempts att 
            WHERE att.student_id = ? AND att.assessment_id = a.id AND att.status = 'submitted'
            ORDER BY att.id DESC LIMIT 1
          ) as last_score
        FROM assessments a
        JOIN mock_test_assignments mta ON a.id = mta.mock_test_id
        LEFT JOIN subjects s ON a.subject_id = s.id
        LEFT JOIN topics t ON a.topic_id = t.id
        LEFT JOIN topics p1 ON t.parent_id = p1.id
        LEFT JOIN topics p2 ON p1.parent_id = p2.id
        LEFT JOIN exams e ON a.exam_id = e.id
        WHERE a.status = 'published' 
          AND mta.student_id = ? 
          AND mta.assignment_status = 'assigned' 
          AND mta.revoked_at IS NULL
      `
      params.push(user.id, user.id, user.id)
    }

    if (subjectId && subjectId !== 'all') {
      if (subjectId === 'full_mock') {
        query += ` AND a.subject_id IS NULL`
      } else {
        query += ` AND a.subject_id = ?`
        params.push(subjectId)
      }
    }

    if (topicId && topicId !== 'all') {
      query += ` AND a.topic_id = ?`
      params.push(topicId)
    }

    if (mainTopicId && mainTopicId !== 'all') {
      query += ` AND (t.id = ? OR p1.id = ? OR p2.id = ?)`
      params.push(mainTopicId, mainTopicId, mainTopicId)
    }

    if (type && type !== 'all') {
      query += ` AND a.assessment_type = ?`
      params.push(type)
    }

    if (difficulty && difficulty !== 'all') {
      const diffLower = difficulty.toLowerCase()
      if (diffLower === 'easy' || diffLower === 'low') {
        query += ` AND (LOWER(a.difficulty_level) = 'low' OR LOWER(a.difficulty_level) = 'easy')`
      } else if (diffLower === 'hard' || diffLower === 'high') {
        query += ` AND (LOWER(a.difficulty_level) = 'high' OR LOWER(a.difficulty_level) = 'hard')`
      } else {
        query += ` AND (LOWER(a.difficulty_level) = 'medium' OR LOWER(a.difficulty_level) = 'moderate')`
      }
    }

    query += ` ORDER BY a.id ASC`

    const [assessments]: any = await db.query(query, params)

    return NextResponse.json({ success: true, assessments })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
