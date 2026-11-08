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

  console.log('Connected. Resetting tables...')

  await connection.query('SET FOREIGN_KEY_CHECKS = 0')
  await connection.query('TRUNCATE TABLE attempt_answers')
  await connection.query('TRUNCATE TABLE attempt_results')
  await connection.query('TRUNCATE TABLE assessment_attempt_questions')
  await connection.query('TRUNCATE TABLE assessment_attempts')
  await connection.query('TRUNCATE TABLE assessment_questions')
  await connection.query('TRUNCATE TABLE assessments')
  await connection.query('TRUNCATE TABLE student_question_reports')
  await connection.query('TRUNCATE TABLE question_options')
  await connection.query('TRUNCATE TABLE questions')
  await connection.query('TRUNCATE TABLE topics')
  await connection.query('TRUNCATE TABLE exam_subjects')
  await connection.query('TRUNCATE TABLE subjects')
  await connection.query('TRUNCATE TABLE students')
  await connection.query('TRUNCATE TABLE admin_role_map')
  await connection.query('TRUNCATE TABLE admin_users')
  await connection.query('SET FOREIGN_KEY_CHECKS = 1')

  console.log('Tables truncated.')

  // 1. Admin Puneet
  await connection.query(
    `INSERT INTO admin_users (id, full_name, email, password_hash, status, created_at)
     VALUES (1, 'Admin Puneet', 'admin@examforge.in', '$2a$10$e8V95yQx8zY8R1m2/q7L4O5a0b7n8p9q', 'active', NOW())`
  )
  await connection.query(`INSERT INTO admin_role_map (admin_id, role_id) VALUES (1, 1)`)

  // 2. Student Puneet
  await connection.query(
    `INSERT INTO students (id, full_name, username, email, mobile, state, district, account_status, created_at)
     VALUES (1, 'Puneet', 'puneet', 'puneet@examforge.in', '9876543210', 'Rajasthan', 'Jaipur', 'active', NOW())`
  )

  // 3. Exam
  await connection.query(
    `INSERT INTO exams (id, name, code, description, status, created_at)
     VALUES (1, 'Rajasthan Informatics Assistant (सूचना सहायक)', 'RAJ_IA_2026', 'RSMSSB Informatics Assistant Examination', 'active', NOW())
     ON DUPLICATE KEY UPDATE name = VALUES(name), code = VALUES(code)`
  )

  // 4. The 4 Official Subjects
  const subjects = [
    [1, 'Computer & Information Technology', 'CIT', 'Computer Fundamentals, Hardware, Software, Networking, Internet, DBMS, MS Office'],
    [2, 'Reasoning & Mental Ability', 'RMA', 'Blood Relation, Coding-Decoding, Series, Direction, Analogy, Ranking, Puzzle'],
    [3, 'Mathematics', 'MATH', 'Percentage, Profit-Loss, Average, Ratio, Time & Work, SI-CI'],
    [4, 'General Knowledge (GK)', 'GK', 'Rajasthan GK, India GK, History, Geography, Polity, Current Affairs, General Science'],
  ]

  for (const s of subjects) {
    await connection.query(
      `INSERT INTO subjects (id, name, code, description, icon, status, created_at) VALUES (?, ?, ?, ?, 'book', 'active', NOW())`,
      s
    )
    await connection.query(`INSERT IGNORE INTO exam_subjects (exam_id, subject_id) VALUES (1, ?)`, [s[0]])
  }

  // 5. Official Topics
  const topics = [
    // Subject 1: CIT
    [101, 1, 'Computer Fundamentals', 'computer-fundamentals', 'high', 1],
    [102, 1, 'Hardware', 'hardware', 'medium', 2],
    [103, 1, 'Software', 'software', 'medium', 3],
    [104, 1, 'Networking', 'networking', 'high', 4],
    [105, 1, 'Internet', 'internet', 'high', 5],
    [106, 1, 'DBMS', 'dbms', 'high', 6],
    [107, 1, 'MS Office', 'ms-office', 'high', 7],

    // Subject 2: RMA
    [201, 2, 'Blood Relation', 'blood-relation', 'high', 1],
    [202, 2, 'Coding-Decoding', 'coding-decoding', 'high', 2],
    [203, 2, 'Series', 'series', 'high', 3],
    [204, 2, 'Direction', 'direction', 'medium', 4],
    [205, 2, 'Analogy', 'analogy', 'medium', 5],
    [206, 2, 'Ranking', 'ranking', 'medium', 6],
    [207, 2, 'Puzzle', 'puzzle', 'high', 7],

    // Subject 3: MATH
    [301, 3, 'Percentage', 'percentage', 'high', 1],
    [302, 3, 'Profit-Loss', 'profit-loss', 'high', 2],
    [303, 3, 'Average', 'average', 'medium', 3],
    [304, 3, 'Ratio', 'ratio', 'medium', 4],
    [305, 3, 'Time & Work', 'time-and-work', 'high', 5],
    [306, 3, 'SI-CI', 'si-ci', 'high', 6],

    // Subject 4: GK
    [401, 4, 'Rajasthan GK', 'rajasthan-gk', 'high', 1],
    [402, 4, 'India GK', 'india-gk', 'medium', 2],
    [403, 4, 'History', 'history', 'medium', 3],
    [404, 4, 'Geography', 'geography', 'high', 4],
    [405, 4, 'Polity', 'polity', 'medium', 5],
    [406, 4, 'Current Affairs', 'current-affairs', 'high', 6],
    [407, 4, 'General Science', 'general-science', 'medium', 7],
  ]

  for (const t of topics) {
    await connection.query(
      `INSERT INTO topics (id, subject_id, name, slug, priority, order_index, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())`,
      t
    )
  }

  // 6. Questions with Native UTF-8 Hindi & English
  const questions = [
    {
      id: 1,
      subject_id: 1,
      topic_id: 106,
      question_text: 'Which normal form is based on the concept of "Full Functional Dependency"?',
      difficulty: 'medium',
      language_code: 'en',
      explanation: 'Second Normal Form (2NF) requires that the relation must be in 1NF and no non-prime attribute is partially dependent on any candidate key of a table (Full Functional Dependency).',
      options: [
        ['A', 'First Normal Form (1NF)', 0],
        ['B', 'Second Normal Form (2NF)', 1],
        ['C', 'Third Normal Form (3NF)', 0],
        ['D', 'Boyce-Codd Normal Form (BCNF)', 0],
      ],
    },
    {
      id: 2,
      subject_id: 1,
      topic_id: 104,
      question_text: 'IPv4 एड्रेस का आकार (Size) कितना होता है?',
      difficulty: 'easy',
      language_code: 'hi',
      explanation: 'IPv4 एड्रेस 32 बिट्स (4 बाइट्स) का होता है, जबकि IPv6 एड्रेस 128 बिट्स (16 बाइट्स) का होता है।',
      options: [
        ['A', '16 बिट्स', 0],
        ['B', '32 बिट्स', 1],
        ['C', '64 बिट्स', 0],
        ['D', '128 बिट्स', 0],
      ],
    },
    {
      id: 3,
      subject_id: 2,
      topic_id: 201,
      question_text: 'एक लड़के की तस्वीर की ओर इशारा करते हुए सुरेश ने कहा, "वह मेरी माँ के इकलौते बेटे का बेटा है।" सुरेश का उस लड़के से क्या संबंध है?',
      difficulty: 'easy',
      language_code: 'hi',
      explanation: 'सुरेश की माँ का इकलौता बेटा खुद सुरेश है। इसलिए वह लड़का सुरेश का बेटा है, यानी सुरेश उसका पिता है।',
      options: [
        ['A', 'भाई', 0],
        ['B', 'चाचा', 0],
        ['C', 'पिता', 1],
        ['D', 'दादा', 0],
      ],
    },
    {
      id: 4,
      subject_id: 2,
      topic_id: 202,
      question_text: 'यदि किसी कूट भाषा में "COMPUTER" को "RFUVQNPC" लिखा जाता है, तो "MEDICINE" को उसी भाषा में क्या लिखा जाएगा?',
      difficulty: 'medium',
      language_code: 'hi',
      explanation: 'पहले और आखिरी अक्षर आपस में बदल जाते हैं और उल्टे क्रम में लिखे जाते हैं, तथा बीच के प्रत्येक अक्षर में +1 की वृद्धि होती है। अतः MEDICINE बन जाता है EOJDJEFM।',
      options: [
        ['A', 'EOJDJEFM', 1],
        ['B', 'MFEDJJOE', 0],
        ['C', 'EOJDEJFM', 0],
        ['D', 'MFEJDJOE', 0],
      ],
    },
    {
      id: 5,
      subject_id: 3,
      topic_id: 301,
      question_text: 'यदि बिजली के बिल में 20% की छूट दी जाती है, तब भी ₹100 का भुगतान करना बाकी है। मूल बिल राशि कितनी थी?',
      difficulty: 'easy',
      language_code: 'hi',
      explanation: 'छूट के बाद शेष प्रतिशत = 80%। यदि 80% = ₹100 है, तो कुल बिल = (100 × 100) / 80 = ₹125।',
      options: [
        ['A', '₹110', 0],
        ['B', '₹120', 0],
        ['C', '₹125', 1],
        ['D', '₹130', 0],
      ],
    },
    {
      id: 6,
      subject_id: 3,
      topic_id: 302,
      question_text: 'एक वस्तु को ₹1440 में बेचने पर एक व्यापारी को 20% का लाभ होता है। वस्तु का क्रय मूल्य (Cost Price) क्या है?',
      difficulty: 'easy',
      language_code: 'hi',
      explanation: 'क्रय मूल्य = (विक्रय मूल्य × 100) / (100 + लाभ%) = (1440 × 100) / 120 = ₹1200।',
      options: [
        ['A', '₹1100', 0],
        ['B', '₹1200', 1],
        ['C', '₹1250', 0],
        ['D', '₹1300', 0],
      ],
    },
    {
      id: 7,
      subject_id: 4,
      topic_id: 401,
      question_text: 'राजस्थान के जयपुर में प्रसिद्ध "हवा महल" का निर्माण किसने करवाया था?',
      difficulty: 'easy',
      language_code: 'hi',
      explanation: 'जयपुर में स्थित हवा महल का निर्माण 1799 ईस्वी में सवाई प्रताप सिंह ने करवाया था। इसके प्रमुख वास्तुकार लालचंद उस्ता थे। इसमें कुल 953 झरोखे हैं।',
      options: [
        ['A', 'सवाई जयसिंह', 0],
        ['B', 'सवाई मानसिंह', 0],
        ['C', 'सवाई प्रताप सिंह', 1],
        ['D', 'राजा भारमल', 0],
      ],
    },
    {
      id: 8,
      subject_id: 4,
      topic_id: 404,
      question_text: 'राजस्थान की किस नदी को "कामधेनु" एवं "चर्मण्वती" के नाम से जाना जाता है?',
      difficulty: 'easy',
      language_code: 'hi',
      explanation: 'चम्बल नदी को राजस्थान की कामधेनु और प्राचीन चर्मण्वती नदी कहा जाता है। यह राजस्थान की प्रमुख बारहमासी नदी है।',
      options: [
        ['A', 'बनास', 0],
        ['B', 'चम्बल', 1],
        ['C', 'लूनी', 0],
        ['D', 'माही', 0],
      ],
    },
  ]

  for (const q of questions) {
    await connection.query(
      `INSERT INTO questions 
       (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
       VALUES (?, ?, ?, ?, 'single_choice', ?, 'approved', ?, 1.00, 0.25, ?, 'Rajasthan IA Official Bank', NOW())`,
      [q.id, q.subject_id, q.topic_id, q.question_text, q.difficulty, q.explanation, q.language_code]
    )

    for (let i = 0; i < q.options.length; i++) {
      const opt = q.options[i]
      await connection.query(
        `INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index)
         VALUES (?, ?, ?, ?, ?)`,
        [q.id, opt[0], opt[1], opt[2], i + 1]
      )
    }
  }

  // 7. Practice Test Drill 01
  await connection.query(
    `INSERT INTO assessments 
     (id, title, slug, description, exam_id, subject_id, topic_id, assessment_type, duration_minutes, total_questions, total_marks, passing_percentage, status, created_at)
     VALUES (1, 'Rajasthan Informatics Assistant (सूचना सहायक) Practice Drill 01', 'rajasthan-ia-drill-01', 'Official practice drill covering Computer & IT, Reasoning, Mathematics, and Rajasthan General Knowledge.', 1, NULL, NULL, 'mock', 30, 8, 8.00, 40.00, 'published', NOW())`
  )

  for (let i = 1; i <= 8; i++) {
    await connection.query(
      `INSERT INTO assessment_questions (assessment_id, section_id, question_id, order_index, marks, negative_marks)
       VALUES (1, NULL, ?, ?, 1.00, 0.25)`,
      [i, i]
    )
  }

  console.log('Seeding completed successfully with genuine UTF-8 Devanagari Hindi text!')
  await connection.end()
}

run().catch((err) => {
  console.error('Seeding error:', err)
  process.exit(1)
})

