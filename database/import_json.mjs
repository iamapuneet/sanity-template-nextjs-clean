import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

async function importJson(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(raw)

  console.log(`\n========================================`)
  console.log(`📦 Importing: ${path.basename(filePath)}`)
  console.log(`Subject: ${data.subject} | Topic: ${data.topic}`)
  console.log(`Category: ${data.category || '-'} | Subcategory: ${data.subcategory || '-'}`)
  console.log(`Questions count: ${data.questions?.length || 0}`)
  console.log(`========================================`)

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'examforge',
    charset: 'utf8',
  })

  // 1. Subject match
  const subjectName = data.subject || 'Reasoning & Mental Ability'
  const [subRows] = await connection.query(
    `SELECT id, name FROM subjects WHERE name LIKE ? OR name LIKE ? LIMIT 1`,
    [`%${subjectName.split(' ')[0]}%`, `%${subjectName}%`]
  )
  const subjectId = subRows[0]?.id || 2
  console.log(`✓ Subject matched: ID ${subjectId} (${subRows[0]?.name || subjectName})`)

  // 2. Topic Hierarchy
  const topicName = data.topic || 'General Topic'
  const [rootRows] = await connection.query(
    `SELECT id FROM topics WHERE subject_id = ? AND (name LIKE ? OR slug LIKE ?) LIMIT 1`,
    [subjectId, `%${topicName}%`, `%${topicName.toLowerCase().replace(/\s+/g, '-')}%`]
  )
  let rootTopicId = rootRows[0]?.id

  if (!rootTopicId) {
    const slug = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const [ins] = await connection.query(
      `INSERT INTO topics (subject_id, name, slug, priority, level, order_index, status, created_at)
       VALUES (?, ?, ?, 'high', 1, 1, 'active', NOW())`,
      [subjectId, topicName, slug]
    )
    rootTopicId = ins.insertId
  }

  let currentTopicId = rootTopicId

  // Category (Subtopic)
  if (data.category) {
    const [catRows] = await connection.query(
      `SELECT id FROM topics WHERE parent_id = ? AND name LIKE ? LIMIT 1`,
      [rootTopicId, `%${data.category}%`]
    )
    if (catRows.length > 0) {
      currentTopicId = catRows[0].id
    } else {
      const slug = data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const [ins] = await connection.query(
        `INSERT INTO topics (subject_id, parent_id, name, slug, priority, level, order_index, status, created_at)
         VALUES (?, ?, ?, ?, 'high', 2, 1, 'active', NOW())`,
        [subjectId, rootTopicId, data.category, slug]
      )
      currentTopicId = ins.insertId
    }
  }

  // Subcategory (Microtopic)
  if (data.subcategory) {
    const parentForMicro = currentTopicId
    const [microRows] = await connection.query(
      `SELECT id FROM topics WHERE parent_id = ? AND name LIKE ? LIMIT 1`,
      [parentForMicro, `%${data.subcategory}%`]
    )
    if (microRows.length > 0) {
      currentTopicId = microRows[0].id
    } else {
      const slug = data.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const [ins] = await connection.query(
        `INSERT INTO topics (subject_id, parent_id, name, slug, priority, level, order_index, status, created_at)
         VALUES (?, ?, ?, ?, 'high', 3, 1, 'active', NOW())`,
        [subjectId, parentForMicro, data.subcategory, slug]
      )
      currentTopicId = ins.insertId
    }
  }

  console.log(`✓ Topic resolved to ID: ${currentTopicId}`)

  // 3. Process Questions
  const diffRaw = (data.difficulty || 'easy').toLowerCase()
  const difficulty = diffRaw.includes('hard') ? 'hard' : diffRaw.includes('mod') ? 'medium' : 'easy'
  const insertedQuestionIds = []

  for (let i = 0; i < (data.questions || []).length; i++) {
    const q = data.questions[i]

    // Check duplicate
    const [exist] = await connection.query(
      `SELECT id FROM questions WHERE question_text = ? LIMIT 1`,
      [q.question]
    )

    let questionId
    if (exist.length > 0) {
      questionId = exist[0].id
    } else {
      const [res] = await connection.query(
        `INSERT INTO questions (
          subject_id, topic_id, question_text, question_type, difficulty,
          status, explanation, default_marks, default_negative_marks,
          language_code, source, created_at
        ) VALUES (?, ?, ?, 'single_choice', ?, 'approved', ?, 1.00, 0.25, 'hi', ?, NOW())`,
        [
          subjectId,
          currentTopicId,
          q.question,
          difficulty,
          q.explanation || '',
          data.test_title || `${data.topic} Practice`
        ]
      )
      questionId = res.insertId

      // Options
      const optKeys = ['A', 'B', 'C', 'D']
      for (let j = 0; j < optKeys.length; j++) {
        const k = optKeys[j]
        const text = q.options[k] || ''
        const isCorrect = q.correct_answer === k ? 1 : 0
        await connection.query(
          `INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index)
           VALUES (?, ?, ?, ?, ?)`,
          [questionId, k, text, isCorrect, j + 1]
        )
      }
    }
    insertedQuestionIds.push(questionId)
  }

  console.log(`✓ Processed ${insertedQuestionIds.length} questions.`)

  // 4. Create or Update Assessment
  const testTitle = data.test_title || `${data.topic} – Practice Assessment`
  const testSlug = testTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const [existAssess] = await connection.query(
    `SELECT id FROM assessments WHERE slug = ? OR title = ? LIMIT 1`,
    [testSlug, testTitle]
  )

  let assessmentId
  if (existAssess.length > 0) {
    assessmentId = existAssess[0].id
    await connection.query(
      `DELETE FROM assessment_questions WHERE assessment_id = ?`,
      [assessmentId]
    )
  } else {
    const duration = insertedQuestionIds.length > 0 ? insertedQuestionIds.length : 20
    const [res] = await connection.query(
      `INSERT INTO assessments (
        title, slug, description, exam_id, subject_id, topic_id,
        assessment_type, duration_minutes, total_questions, total_marks,
        passing_percentage, status, created_at
      ) VALUES (
        ?, ?, ?, 1, ?, ?,
        'topic_test', ?, ?, ?,
        40.00, 'published', NOW()
      )`,
      [
        testTitle,
        testSlug,
        `${testTitle} - ${insertedQuestionIds.length} questions on ${data.topic} (${data.category || ''} > ${data.subcategory || ''}).`,
        subjectId,
        currentTopicId,
        duration,
        insertedQuestionIds.length,
        insertedQuestionIds.length * 1.0
      ]
    )
    assessmentId = res.insertId
  }

  // Link questions to assessment
  for (let idx = 0; idx < insertedQuestionIds.length; idx++) {
    await connection.query(
      `INSERT INTO assessment_questions (assessment_id, section_id, question_id, order_index, marks, negative_marks)
       VALUES (?, NULL, ?, ?, 1.00, 0.25)`,
      [assessmentId, insertedQuestionIds[idx], idx + 1]
    )
  }

  console.log(`✓ Linked to Assessment ID ${assessmentId} ("${testTitle}")`)
  console.log(`🎉 SUCCESS: All ${insertedQuestionIds.length} questions are live on http://localhost:3000/practice`)

  await connection.end()
}

const targetPath = process.argv[2] || path.join(process.cwd(), 'mock_data', '02_blood_relation_level1_part2.json')
importJson(targetPath).catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
