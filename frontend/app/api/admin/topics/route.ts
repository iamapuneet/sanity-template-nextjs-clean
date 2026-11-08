import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subject_id')

    let query = `
      SELECT 
        t.id,
        t.subject_id,
        t.parent_id,
        t.name,
        t.slug,
        t.code,
        t.priority,
        t.level,
        t.order_index,
        t.status,
        s.name as subject_name,
        p.name as parent_name,
        COUNT(q.id) as questions_count
      FROM topics t
      JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN topics p ON t.parent_id = p.id
      LEFT JOIN questions q ON t.id = q.topic_id
    `
    const params: any[] = []

    if (subjectId) {
      query += ` WHERE t.subject_id = ?`
      params.push(subjectId)
    }

    query += ` GROUP BY t.id ORDER BY s.id ASC, t.level ASC, t.order_index ASC, t.name ASC`

    const [topics]: any = await db.query(query, params)

    return NextResponse.json({ success: true, topics })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { subject_id, parent_id = null, name, priority = 'medium', level = 1, order_index = 0, status = 'active' } = body

    if (!subject_id || !name) {
      return NextResponse.json({ success: false, error: 'Subject and Topic Name are required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const [result]: any = await db.query(
      `INSERT INTO topics (subject_id, parent_id, name, slug, priority, level, order_index, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [subject_id, parent_id || null, name, slug, priority, level, order_index, status]
    )

    return NextResponse.json({ success: true, topicId: result.insertId, message: 'Topic created successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, subject_id, parent_id, name, priority, level, order_index, status } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Topic ID is required' }, { status: 400 })
    }

    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : null

    await db.query(
      `UPDATE topics 
       SET subject_id = COALESCE(?, subject_id),
           parent_id = ?,
           name = COALESCE(?, name),
           slug = COALESCE(?, slug),
           priority = COALESCE(?, priority),
           level = COALESCE(?, level),
           order_index = COALESCE(?, order_index),
           status = COALESCE(?, status),
           updated_at = NOW()
       WHERE id = ?`,
      [subject_id, parent_id || null, name, slug, priority, level, order_index, status, id]
    )

    return NextResponse.json({ success: true, message: 'Topic updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Topic ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM topics WHERE id = ?`, [id])

    return NextResponse.json({ success: true, message: 'Topic deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

