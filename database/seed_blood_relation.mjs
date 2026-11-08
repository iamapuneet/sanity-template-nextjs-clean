import mysql from 'mysql2/promise'

async function run() {
  console.log('Connecting to MySQL with UTF-8 charset...')

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'examforge',
    charset: 'utf8',
  })

  console.log('Connected.')

  // 1. Ensure Subject "Reasoning & Mental Ability" exists
  const [subjectRows] = await connection.query(
    `SELECT id FROM subjects WHERE name LIKE '%Reasoning%' OR code = 'RMA' LIMIT 1`
  )
  const subjectId = subjectRows[0] ? subjectRows[0].id : 2

  // 2. Ensure Topic Hierarchy:
  // Blood Relation (Root Topic) -> Basic / One Line Questions (Subtopic) -> Direct Relationship (Microtopic)
  const [rootRows] = await connection.query(
    `SELECT id FROM topics WHERE subject_id = ? AND name LIKE '%Blood Relation%' LIMIT 1`,
    [subjectId]
  )
  let rootTopicId = rootRows[0] ? rootRows[0].id : null

  if (!rootTopicId) {
    const [res] = await connection.query(
      `INSERT INTO topics (subject_id, name, slug, priority, level, order_index, status, created_at)
       VALUES (?, 'Blood Relation (रक्त संबंध)', 'blood-relation', 'high', 1, 1, 'active', NOW())`,
      [subjectId]
    )
    rootTopicId = res.insertId
  }

  // Subtopic: Basic / One Line Questions
  const [subRows] = await connection.query(
    `SELECT id FROM topics WHERE parent_id = ? AND name LIKE '%Basic%' LIMIT 1`,
    [rootTopicId]
  )
  let subTopicId = subRows[0] ? subRows[0].id : null

  if (!subTopicId) {
    const [res] = await connection.query(
      `INSERT INTO topics (subject_id, parent_id, name, slug, priority, level, order_index, status, created_at)
       VALUES (?, ?, 'Basic / One Line Questions', 'basic-one-line-questions', 'high', 2, 1, 'active', NOW())`,
      [subjectId, rootTopicId]
    )
    subTopicId = res.insertId
  }

  // Microtopic: Direct Relationship
  const [microRows] = await connection.query(
    `SELECT id FROM topics WHERE parent_id = ? AND name LIKE '%Direct Relationship%' LIMIT 1`,
    [subTopicId]
  )
  let microTopicId = microRows[0] ? microRows[0].id : null

  if (!microTopicId) {
    const [res] = await connection.query(
      `INSERT INTO topics (subject_id, parent_id, name, slug, priority, level, order_index, status, created_at)
       VALUES (?, ?, 'Direct Relationship', 'direct-relationship', 'high', 3, 1, 'active', NOW())`,
      [subjectId, subTopicId]
    )
    microTopicId = res.insertId
  }

  console.log(`Topic hierarchy ensured: Root ${rootTopicId} -> Sub ${subTopicId} -> Micro ${microTopicId}`)

  // 3. Clear previous mock tests / assessments
  await connection.query('SET FOREIGN_KEY_CHECKS = 0')
  await connection.query('TRUNCATE TABLE attempt_answers')
  await connection.query('TRUNCATE TABLE attempt_results')
  await connection.query('TRUNCATE TABLE assessment_attempt_questions')
  await connection.query('TRUNCATE TABLE assessment_attempts')
  await connection.query('TRUNCATE TABLE assessment_questions')
  await connection.query('TRUNCATE TABLE assessments')
  await connection.query('SET FOREIGN_KEY_CHECKS = 1')
  console.log('Previous mock tests removed.')

  // 4. The 20 Official Questions provided by User
  const rawQuestions = [
    {
      question: "राम, श्याम का पिता है। श्याम का राम से क्या संबंध है?",
      options: { "A": "भाई", "B": "पुत्र", "C": "पिता", "D": "चाचा" },
      correct_answer: "B",
      explanation: "राम श्याम का पिता है, इसलिए श्याम राम का पुत्र है।"
    },
    {
      question: "सीता, गीता की माता है। गीता का सीता से क्या संबंध है?",
      options: { "A": "पुत्री", "B": "बहन", "C": "माता", "D": "भाभी" },
      correct_answer: "A",
      explanation: "सीता गीता की माता है, इसलिए गीता सीता की पुत्री है।"
    },
    {
      question: "मोहन, सोहन का भाई है। सोहन का मोहन से क्या संबंध है?",
      options: { "A": "पिता", "B": "भाई", "C": "पुत्र", "D": "मामा" },
      correct_answer: "B",
      explanation: "दोनों एक-दूसरे के भाई हैं।"
    },
    {
      question: "राधा, मोहन की बहन है। मोहन का राधा से क्या संबंध है?",
      options: { "A": "भाई", "B": "पिता", "C": "पुत्र", "D": "चाचा" },
      correct_answer: "A",
      explanation: "राधा मोहन की बहन है, इसलिए मोहन राधा का भाई है।"
    },
    {
      question: "अमित, रवि का पुत्र है। रवि का अमित से क्या संबंध है?",
      options: { "A": "भाई", "B": "पिता", "C": "चाचा", "D": "मामा" },
      correct_answer: "B",
      explanation: "अमित रवि का पुत्र है, इसलिए रवि अमित का पिता है।"
    },
    {
      question: "पूजा, नेहा की माता है। नेहा का पूजा से क्या संबंध है?",
      options: { "A": "बहन", "B": "पुत्री", "C": "माता", "D": "चाची" },
      correct_answer: "B",
      explanation: "पूजा नेहा की माता है, इसलिए नेहा पूजा की पुत्री है।"
    },
    {
      question: "राहुल, अजय का बड़ा भाई है। अजय का राहुल से क्या संबंध है?",
      options: { "A": "छोटा भाई", "B": "पिता", "C": "चाचा", "D": "पुत्र" },
      correct_answer: "A",
      explanation: "राहुल बड़ा भाई है, इसलिए अजय छोटा भाई है।"
    },
    {
      question: "सीमा, रीना की छोटी बहन है। रीना का सीमा से क्या संबंध है?",
      options: { "A": "माता", "B": "बड़ी बहन", "C": "पुत्री", "D": "भाभी" },
      correct_answer: "B",
      explanation: "सीमा छोटी बहन है, इसलिए रीना बड़ी बहन है।"
    },
    {
      question: "अजय, विजय का पिता है। विजय का अजय से क्या संबंध है?",
      options: { "A": "पुत्र", "B": "पिता", "C": "भाई", "D": "मामा" },
      correct_answer: "A",
      explanation: "अजय विजय का पिता है, इसलिए विजय अजय का पुत्र है।"
    },
    {
      question: "गीता, मीना की माता है। मीना का गीता से क्या संबंध है?",
      options: { "A": "माता", "B": "पुत्री", "C": "बहन", "D": "चाची" },
      correct_answer: "B",
      explanation: "गीता मीना की माता है, इसलिए मीना गीता की पुत्री है।"
    },
    {
      question: "रमेश, सुरेश का दादा है। सुरेश का रमेश से क्या संबंध है?",
      options: { "A": "पोता", "B": "पिता", "C": "भाई", "D": "चाचा" },
      correct_answer: "A",
      explanation: "रमेश सुरेश का दादा है, इसलिए सुरेश रमेश का पोता है।"
    },
    {
      question: "कमला, रानी की दादी है। रानी का कमला से क्या संबंध है?",
      options: { "A": "पुत्री", "B": "पोती", "C": "बहन", "D": "माता" },
      correct_answer: "B",
      explanation: "कमला रानी की दादी है, इसलिए रानी कमला की पोती है।"
    },
    {
      question: "मोहन, राहुल का चाचा है। राहुल का मोहन से क्या संबंध है?",
      options: { "A": "भतीजा", "B": "पिता", "C": "मामा", "D": "भाई" },
      correct_answer: "A",
      explanation: "चाचा के भाई की संतान का पुरुष सदस्य उसका भतीजा होता है।"
    },
    {
      question: "सुनीता, पूजा की मौसी है। पूजा का सुनीता से क्या संबंध है?",
      options: { "A": "बहन", "B": "भांजी", "C": "पुत्री", "D": "माता" },
      correct_answer: "B",
      explanation: "मौसी की बहन की बेटी उसकी भांजी होती है।"
    },
    {
      question: "राजेश, सीमा का मामा है। सीमा का राजेश से क्या संबंध है?",
      options: { "A": "भतीजी", "B": "भांजी", "C": "बहन", "D": "पुत्री" },
      correct_answer: "B",
      explanation: "मामा की बहन की बेटी उसकी भांजी होती है।"
    },
    {
      question: "अनीता, रोहित की बुआ है। रोहित का अनीता से क्या संबंध है?",
      options: { "A": "भतीजा", "B": "भांजा", "C": "भाई", "D": "पुत्र" },
      correct_answer: "A",
      explanation: "बुआ के भाई का बेटा उसका भतीजा होता है।"
    },
    {
      question: "सुरेश, महेश का ससुर है। महेश का सुरेश से क्या संबंध है?",
      options: { "A": "पुत्र", "B": "दामाद", "C": "भाई", "D": "साला" },
      correct_answer: "B",
      explanation: "ससुर का संबंध दामाद से होता है।"
    },
    {
      question: "रीना, अमित की पत्नी है। अमित का रीना से क्या संबंध है?",
      options: { "A": "भाई", "B": "पति", "C": "पिता", "D": "देवर" },
      correct_answer: "B",
      explanation: "रीना अमित की पत्नी है, इसलिए अमित रीना का पति है।"
    },
    {
      question: "कविता, दीपक की सास है। दीपक का कविता से क्या संबंध है?",
      options: { "A": "दामाद", "B": "पुत्र", "C": "भाई", "D": "ससुर" },
      correct_answer: "A",
      explanation: "सास का संबंध दामाद से होता है।"
    },
    {
      question: "विनोद, अजय का पिता है और अजय, करण का पिता है। करण का विनोद से क्या संबंध है?",
      options: { "A": "पुत्र", "B": "पोता", "C": "भाई", "D": "भतीजा" },
      correct_answer: "B",
      explanation: "विनोद अजय का पिता और अजय करण का पिता है, इसलिए करण विनोद का पोता है।"
    }
  ]

  const insertedQuestionIds = []

  for (let i = 0; i < rawQuestions.length; i++) {
    const item = rawQuestions[i]

    const [qRes] = await connection.query(
      `INSERT INTO questions 
       (subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
       VALUES (?, ?, ?, 'single_choice', 'easy', 'approved', ?, 1.00, 0.25, 'hi', 'Blood Relation Level 1 - Direct Relationship', NOW())`,
      [subjectId, microTopicId, item.question, item.explanation]
    )

    const questionId = qRes.insertId
    insertedQuestionIds.push(questionId)

    // Insert options A, B, C, D
    const optionKeys = ['A', 'B', 'C', 'D']
    for (let oIdx = 0; oIdx < optionKeys.length; oIdx++) {
      const key = optionKeys[oIdx]
      const text = item.options[key]
      const isCorrect = item.correct_answer === key ? 1 : 0

      await connection.query(
        `INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index)
         VALUES (?, ?, ?, ?, ?)`,
        [questionId, key, text, isCorrect, oIdx + 1]
      )
    }
  }

  console.log(`Inserted ${insertedQuestionIds.length} questions into Question Bank.`)

  // 5. Create New Mock Test for Available Practice Mock Tests
  const [assessmentRes] = await connection.query(
    `INSERT INTO assessments 
     (title, slug, description, exam_id, subject_id, topic_id, assessment_type, duration_minutes, total_questions, total_marks, passing_percentage, status, created_at)
     VALUES (?, ?, ?, 1, ?, ?, 'topic_test', 20, 20, 20.00, 40.00, 'published', NOW())`,
    [
      'Blood Relation (रक्त संबंध) – Level 1 High Priority Practice Test',
      'blood-relation-level-1-direct-relationship',
      'Reasoning: Blood Relation → Basic / One Line Questions → Direct Relationship. 20 questions with real-time countdown and per-question time tracking.',
      subjectId,
      microTopicId,
    ]
  )

  const assessmentId = assessmentRes.insertId

  for (let i = 0; i < insertedQuestionIds.length; i++) {
    await connection.query(
      `INSERT INTO assessment_questions (assessment_id, section_id, question_id, order_index, marks, negative_marks)
       VALUES (?, NULL, ?, ?, 1.00, 0.25)`,
      [assessmentId, insertedQuestionIds[i], i + 1]
    )
  }

  console.log(`Created new practice test ID: ${assessmentId} with ${insertedQuestionIds.length} questions linked.`)
  await connection.end()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
