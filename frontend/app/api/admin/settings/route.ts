import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const [rows]: any = await db.query(`SELECT setting_key, setting_value FROM system_settings`)
    const settings: Record<string, string> = {}
    for (const r of rows) {
      settings[r.setting_key] = r.setting_value
    }
    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { settings } = body

    if (settings && typeof settings === 'object') {
      for (const [key, val] of Object.entries(settings)) {
        await db.query(
          `INSERT INTO system_settings (setting_key, setting_value, updated_at) 
           VALUES (?, ?, NOW()) 
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
          [key, String(val)]
        )
      }
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
