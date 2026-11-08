import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const [subjects]: any = await db.query(`
      SELECT 
        s.id,
        s.name,
        s.code,
        s.description,
        s.icon,
        s.status,
        s.created_at,
        COUNT(DISTINCT t.id) as topics_count,
        COUNT(DISTINCT q.id) as questions_count
      FROM subjects s
      LEFT JOIN topics t ON s.id = t.subject_id
      LEFT JOIN questions q ON s.id = q.subject_id
      GROUP BY s.id
      ORDER BY s.id ASC
    `)

    return NextResponse.json({ success: true, subjects })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, code, description, icon = 'book', status = 'active' } = body

    if (!name || !code) {
      return NextResponse.json({ success: false, error: 'Name and Code are required' }, { status: 400 })
    }

    const [result]: any = await db.query(
      `INSERT INTO subjects (name, code, description, icon, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, code.toUpperCase().replace(/\s+/g, '_'), description || null, icon, status]
    )

    return NextResponse.json({ success: true, subjectId: result.insertId, message: 'Subject created successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, code, description, icon, status } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Subject ID is required' }, { status: 400 })
    }

    await db.query(
      `UPDATE subjects SET name = ?, code = ?, description = ?, icon = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [name, code, description, icon || 'book', status || 'active', id]
    )

    return NextResponse.json({ success: true, message: 'Subject updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Subject ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM subjects WHERE id = ?`, [id])

    return NextResponse.json({ success: true, message: 'Subject deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
