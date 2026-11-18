import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subject_id')

    let whereClause = ''
    const params: any[] = []

    if (subjectId && subjectId !== 'all') {
      whereClause = 'WHERE t.subject_id = ?'
      params.push(Number(subjectId))
    }

    const [topics]: any = await db.query(
      `SELECT 
        t.id,
        t.subject_id,
        t.parent_id,
        t.name,
        t.level,
        t.order_index,
        s.name as subject_name,
        s.code as subject_code,
        COUNT(DISTINCT a.id) as tests_count
      FROM topics t
      JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN assessments a ON (a.topic_id = t.id OR a.topic_id IN (SELECT id FROM topics WHERE parent_id = t.id)) AND a.status = 'published'
      ${whereClause}
      GROUP BY t.id, t.subject_id, t.parent_id, t.name, t.level, t.order_index, s.name, s.code
      ORDER BY s.id ASC, t.level ASC, t.order_index ASC, t.name ASC`,
      params
    )

    return NextResponse.json({ success: true, topics })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
