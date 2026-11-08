'use client'

import React, { useEffect, useState } from 'react'
import { Icons } from '@/components/admin/Icons'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [settings, setSettings] = useState({
    platform_name: 'ExamForge - Rajasthan Informatics Assistant',
    default_marks: '1.00',
    default_negative_marks: '0.25',
    default_passing_percentage: '40.00',
    default_duration_minutes: '60',
    exam_authority: 'RSMSSB (Rajasthan Staff Selection Board)',
    exam_language_default: 'Bilingual (Hindi & English)',
  })

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings')
      const json = await res.json()
      if (json.success && json.settings) {
        setSettings((prev) => ({ ...prev, ...json.settings }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedSuccess(false)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const json = await res.json()
      if (json.success) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      } else {
        alert(json.error || 'Failed to save configuration')
      }
    } catch (err) {
      console.error(err)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-black text-black tracking-tight">Platform Settings</h1>
        <p className="text-sm text-gray-500">
          Configure examination rules, default marking schemes, and Rajasthan IA platform parameters.
        </p>
      </div>

      {/* Scope Restriction Banner */}
      <div className="p-4 rounded-2xl bg-neutral-900 text-white border border-neutral-800 text-xs flex items-start gap-3">
        <Icons.Shield size={20} className="shrink-0 mt-0.5 text-white" />
        <div className="space-y-1">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            ExamForge Architecture & Scope Mandate:
          </span>
          <p className="leading-relaxed text-neutral-300">
            ExamForge is dedicated strictly to curated Rajasthan Government Exam preparation with MySQL persistence, hierarchical syllabus trees, manual MCQ authoring, and candidate per-question time tracking. AI auto-generation and Google Forms export are intentionally omitted in accordance with specifications.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* General Branding */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-black border-b border-gray-100 pb-2">
            General Branding & Organization
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Platform Title *
            </label>
            <input
              type="text"
              required
              value={settings.platform_name}
              onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Conducting Authority
              </label>
              <input
                type="text"
                value={settings.exam_authority}
                onChange={(e) => setSettings({ ...settings, exam_authority: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Language Support
              </label>
              <input
                type="text"
                value={settings.exam_language_default}
                onChange={(e) => setSettings({ ...settings, exam_language_default: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Examination Defaults */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-black border-b border-gray-100 pb-2">
            Default Marking & Examination Parameters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Marks / Question
              </label>
              <input
                type="text"
                value={settings.default_marks}
                onChange={(e) => setSettings({ ...settings, default_marks: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Negative Penalty
              </label>
              <input
                type="text"
                value={settings.default_negative_marks}
                onChange={(e) => setSettings({ ...settings, default_negative_marks: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Pass Percentage (%)
              </label>
              <input
                type="text"
                value={settings.default_passing_percentage}
                onChange={(e) => setSettings({ ...settings, default_passing_percentage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Default Duration (Mins)
              </label>
              <input
                type="text"
                value={settings.default_duration_minutes}
                onChange={(e) => setSettings({ ...settings, default_duration_minutes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-black font-mono font-medium"
              />
            </div>
          </div>
        </div>

        {/* Database Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-2">
          <h2 className="text-base font-bold text-black">Database Connection Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1 text-gray-600">
            <div>Engine: <strong>MySQL 5.5</strong></div>
            <div>Database: <strong>examforge</strong></div>
            <div>Tables Live: <strong>34 Active</strong></div>
            <div>Host: <strong>localhost:3306</strong></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-black flex items-center gap-1.5">
              <Icons.CheckCircle size={16} /> Configuration saved to MySQL successfully!
            </span>
          ) : (
            <span></span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  )
}
