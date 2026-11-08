import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const [admins]: any = await db.query(`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.status,
        u.last_login_at,
        u.created_at,
        r.id as role_id,
        r.name as role_name,
        r.description as role_description
      FROM admin_users u
      LEFT JOIN admin_role_map arm ON u.id = arm.admin_id
      LEFT JOIN roles r ON arm.role_id = r.id
      ORDER BY u.id ASC
    `)

    const [roles]: any = await db.query(`SELECT id, name, description FROM roles ORDER BY id ASC`)

    return NextResponse.json({ success: true, admins, roles })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, role_id = 2, status = 'active' } = body

    if (!full_name || !email) {
      return NextResponse.json({ success: false, error: 'Full name and email are required' }, { status: 400 })
    }

    const [result]: any = await db.query(
      `INSERT INTO admin_users (full_name, email, password_hash, status, created_at)
       VALUES (?, ?, '$2a$10$hashed_sample_secret_key', ?, NOW())`,
      [full_name, email, status]
    )

    const adminId = result.insertId

    if (role_id) {
      await db.query(`INSERT INTO admin_role_map (admin_id, role_id) VALUES (?, ?)`, [adminId, role_id])
    }

    return NextResponse.json({ success: true, adminId, message: 'Admin user added successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, role_id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 })
    }

    if (status) {
      await db.query(`UPDATE admin_users SET status = ?, updated_at = NOW() WHERE id = ?`, [status, id])
    }

    if (role_id) {
      await db.query(`DELETE FROM admin_role_map WHERE admin_id = ?`, [id])
      await db.query(`INSERT INTO admin_role_map (admin_id, role_id) VALUES (?, ?)`, [id, role_id])
    }

    return NextResponse.json({ success: true, message: 'Admin user updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Admin ID is required' }, { status: 400 })
    }

    await db.query(`DELETE FROM admin_role_map WHERE admin_id = ?`, [id])
    await db.query(`DELETE FROM admin_users WHERE id = ?`, [id])

    return NextResponse.json({ success: true, message: 'Admin user removed successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

