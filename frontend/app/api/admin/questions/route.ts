import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subject_id')
    const topicId = searchParams.get('topic_id')
    const difficulty = searchParams.get('difficulty')
    const status = searchParams.get('status')
    const language = searchParams.get('language')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let params: any[] = []

    if (subjectId && subjectId !== 'all') {
      whereClauses.push('q.subject_id = ?')
      params.push(subjectId)
    }
    if (topicId && topicId !== 'all') {
      whereClauses.push('q.topic_id = ?')
      params.push(topicId)
    }
    if (difficulty && difficulty !== 'all') {
      whereClauses.push('q.difficulty = ?')
      params.push(difficulty)
    }
    if (status && status !== 'all') {
      whereClauses.push('q.status = ?')
      params.push(status)
    }
    if (language && language !== 'all') {
      whereClauses.push('q.language_code = ?')
      params.push(language)
    }
    if (search && search.trim()) {
      whereClauses.push('(q.question_text LIKE ? OR q.explanation LIKE ?)')
      params.push(`%${search.trim()}%`, `%${search.trim()}%`)
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    // Total count
    const [[countRow]]: any = await db.query(
      `SELECT COUNT(*) as total FROM questions q ${whereSql}`,
      params
    )

    // Questions query
    const [questions]: any = await db.query(
      `SELECT 
        q.id,
        q.subject_id,
        q.topic_id,
        q.question_text,
        q.question_type,
        q.difficulty,
        q.status,
        q.explanation,
        q.default_marks,
        q.default_negative_marks,
        q.language_code,
        q.source,
        q.created_at,
        s.name as subject_name,
        t.name as topic_name
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      JOIN topics t ON q.topic_id = t.id
      ${whereSql}
      ORDER BY q.id DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    // Fetch options for all returned questions
    if (questions.length > 0) {
      const questionIds = questions.map((q: any) => q.id)
      const [options]: any = await db.query(
        `SELECT id, question_id, option_key, option_text, is_correct, order_index 
         FROM question_options 
         WHERE question_id IN (${questionIds.map(() => '?').join(',')}) 
         ORDER BY order_index ASC`,
        questionIds
      )

      const optionsMap: Record<number, any[]> = {}
      for (const opt of options) {
        if (!optionsMap[opt.question_id]) {
          optionsMap[opt.question_id] = []
        }
        optionsMap[opt.question_id].push({
          id: opt.id,
          key: opt.option_key,
          text: opt.option_text,
          isCorrect: Boolean(opt.is_correct),
        })
      }

      for (const q of questions) {
        q.options = optionsMap[q.id] || []
        const correctOpt = q.options.find((o: any) => o.isCorrect)
        q.correct_option = correctOpt ? correctOpt.key : null
      }
    }

    return NextResponse.json({
      success: true,
      questions,
      pagination: {
        page,
        limit,
        total: Number(countRow?.total || 0),
        totalPages: Math.ceil(Number(countRow?.total || 0) / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      subject_id,
      topic_id,
      question_text,
      question_type = 'single_choice',
      difficulty = 'medium',
      status = 'pending',
      explanation,
      default_marks = 1.0,
      default_negative_marks = 0.25,
      language_code = 'en',
      source,
      options = [], // [{ key: 'A', text: '...', isCorrect: true }]
    } = body

    if (!subject_id || !topic_id || !question_text) {
      return NextResponse.json({ success: false, error: 'Subject, topic, and question text are required' }, { status: 400 })
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ success: false, error: 'At least 2 options are required' }, { status: 400 })
    }

    const [res]: any = await db.query(
      `INSERT INTO questions 
       (subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        subject_id,
        topic_id,
        question_text,
        question_type,
        difficulty,
        status,
        explanation || null,
        default_marks,
        default_negative_marks,
        language_code,
        source || null,
      ]
    )

    const questionId = res.insertId

    for (let i = 0; i < options.length; i++) {
      const opt = options[i]
      await db.query(
        `INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index)
         VALUES (?, ?, ?, ?, ?)`,
        [questionId, opt.key, opt.text, opt.isCorrect ? 1 : 0, i + 1]
      )
    }

    return NextResponse.json({ success: true, questionId, message: 'Question created successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      subject_id,
      topic_id,
      question_text,
      difficulty,
      status,
      explanation,
      default_marks,
      default_negative_marks,
      language_code,
      source,
      options,
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Question ID is required' }, { status: 400 })
    }

    await db.query(
      `UPDATE questions
       SET subject_id = COALESCE(?, subject_id),
           topic_id = COALESCE(?, topic_id),
           question_text = COALESCE(?, question_text),
           difficulty = COALESCE(?, difficulty),
           status = COALESCE(?, status),
           explanation = COALESCE(?, explanation),
           default_marks = COALESCE(?, default_marks),
           default_negative_marks = COALESCE(?, default_negative_marks),
           language_code = COALESCE(?, language_code),
           source = COALESCE(?, source),
           updated_at = NOW()
       WHERE id = ?`,
      [
        subject_id,
        topic_id,
        question_text,
        difficulty,
        status,
        explanation,
        default_marks,
        default_negative_marks,
        language_code,
        source,
        id,
      ]
    )

    if (Array.isArray(options) && options.length > 0) {
      await db.query(`DELETE FROM question_options WHERE question_id = ?`, [id])
      for (let i = 0; i < options.length; i++) {
        const opt = options[i]
        await db.query(
          `INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index)
           VALUES (?, ?, ?, ?, ?)`,
          [id, opt.key, opt.text, opt.isCorrect ? 1 : 0, i + 1]
        )
      }
    }

    return NextResponse.json({ success: true, message: 'Question updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Question ID and status are required' }, { status: 400 })
    }

    await db.query(`UPDATE questions SET status = ?, updated_at = NOW() WHERE id = ?`, [status, id])

    return NextResponse.json({ success: true, message: `Question status updated to ${status}` })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Question ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM question_options WHERE question_id = ?`, [id])
    await db.query(`DELETE FROM questions WHERE id = ?`, [id])

    return NextResponse.json({ success: true, message: 'Question deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

