-- ============================================================
-- ExamForge: Official Clean Reset & Seed Script
-- Removes all fake/old data and sets up the 4 official subjects,
-- official topics, new admin, and student "Puneet".
-- ============================================================

USE examforge;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Truncate previous data
TRUNCATE TABLE attempt_answers;
TRUNCATE TABLE attempt_results;
TRUNCATE TABLE assessment_attempt_questions;
TRUNCATE TABLE assessment_attempts;
TRUNCATE TABLE assessment_questions;
TRUNCATE TABLE assessments;
TRUNCATE TABLE student_question_reports;
TRUNCATE TABLE question_options;
TRUNCATE TABLE questions;
TRUNCATE TABLE topics;
TRUNCATE TABLE exam_subjects;
TRUNCATE TABLE subjects;
TRUNCATE TABLE students;
TRUNCATE TABLE admin_role_map;
TRUNCATE TABLE admin_users;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Official Admin User
INSERT INTO admin_users (id, full_name, email, password_hash, status, created_at)
VALUES 
(1, 'Admin Puneet', 'admin@examforge.in', '$2a$10$e8V95yQx8zY8R1m2/q7L4O5a0b7n8p9q', 'active', NOW());

INSERT INTO admin_role_map (admin_id, role_id)
VALUES (1, 1); -- super_admin

-- 3. Official Student: Puneet
INSERT INTO students (id, full_name, username, email, mobile, state, district, account_status, created_at)
VALUES 
(1, 'Puneet', 'puneet', 'puneet@examforge.in', '9876543210', 'Rajasthan', 'Jaipur', 'active', NOW());

-- 4. Official Exam: Rajasthan Informatics Assistant
INSERT INTO exams (id, name, code, description, status, created_at)
VALUES 
(1, 'Rajasthan Informatics Assistant (सूचना सहायक)', 'RAJ_IA_2026', 'RSMSSB Informatics Assistant Competitive Examination', 'active', NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name), code = VALUES(code);

-- 5. The 4 Official Subjects
INSERT INTO subjects (id, name, code, description, icon, status, created_at)
VALUES 
(1, 'Computer & Information Technology', 'CIT', 'Computer Fundamentals, Hardware, Software, Networking, Internet, DBMS, MS Office', 'cpu', 'active', NOW()),
(2, 'Reasoning & Mental Ability', 'RMA', 'Blood Relation, Coding-Decoding, Series, Direction, Analogy, Ranking, Puzzle', 'brain', 'active', NOW()),
(3, 'Mathematics', 'MATH', 'Percentage, Profit-Loss, Average, Ratio, Time & Work, SI-CI', 'calculator', 'active', NOW()),
(4, 'General Knowledge (GK)', 'GK', 'Rajasthan GK, India GK, History, Geography, Polity, Current Affairs, General Science', 'globe', 'active', NOW());

-- Link the 4 subjects to Rajasthan IA Exam
INSERT INTO exam_subjects (exam_id, subject_id)
VALUES 
(1, 1),
(1, 2),
(1, 3),
(1, 4);

-- 6. Official Topics for Subject 1: Computer & Information Technology (CIT)
INSERT INTO topics (id, subject_id, name, slug, priority, level, order_index, status, created_at) VALUES
(101, 1, 'Computer Fundamentals', 'computer-fundamentals', 'high', 1, 1, 'active', NOW()),
(102, 1, 'Hardware', 'hardware', 'medium', 1, 2, 'active', NOW()),
(103, 1, 'Software', 'software', 'medium', 1, 3, 'active', NOW()),
(104, 1, 'Networking', 'networking', 'high', 1, 4, 'active', NOW()),
(105, 1, 'Internet', 'internet', 'high', 1, 5, 'active', NOW()),
(106, 1, 'DBMS', 'dbms', 'high', 1, 6, 'active', NOW()),
(107, 1, 'MS Office', 'ms-office', 'high', 1, 7, 'active', NOW());

-- 7. Official Topics for Subject 2: Reasoning & Mental Ability (RMA)
INSERT INTO topics (id, subject_id, name, slug, priority, level, order_index, status, created_at) VALUES
(201, 2, 'Blood Relation', 'blood-relation', 'high', 1, 1, 'active', NOW()),
(202, 2, 'Coding-Decoding', 'coding-decoding', 'high', 1, 2, 'active', NOW()),
(203, 2, 'Series', 'series', 'high', 1, 3, 'active', NOW()),
(204, 2, 'Direction', 'direction', 'medium', 1, 4, 'active', NOW()),
(205, 2, 'Analogy', 'analogy', 'medium', 1, 5, 'active', NOW()),
(206, 2, 'Ranking', 'ranking', 'medium', 1, 6, 'active', NOW()),
(207, 2, 'Puzzle', 'puzzle', 'high', 1, 7, 'active', NOW());

-- 8. Official Topics for Subject 3: Mathematics (MATH)
INSERT INTO topics (id, subject_id, name, slug, priority, level, order_index, status, created_at) VALUES
(301, 3, 'Percentage', 'percentage', 'high', 1, 1, 'active', NOW()),
(302, 3, 'Profit-Loss', 'profit-loss', 'high', 1, 2, 'active', NOW()),
(303, 3, 'Average', 'average', 'medium', 1, 3, 'active', NOW()),
(304, 3, 'Ratio', 'ratio', 'medium', 1, 4, 'active', NOW()),
(305, 3, 'Time & Work', 'time-and-work', 'high', 1, 5, 'active', NOW()),
(306, 3, 'SI-CI', 'si-ci', 'high', 1, 6, 'active', NOW());

-- 9. Official Topics for Subject 4: General Knowledge (GK)
INSERT INTO topics (id, subject_id, name, slug, priority, level, order_index, status, created_at) VALUES
(401, 4, 'Rajasthan GK', 'rajasthan-gk', 'high', 1, 1, 'active', NOW()),
(402, 4, 'India GK', 'india-gk', 'medium', 1, 2, 'active', NOW()),
(403, 4, 'History', 'history', 'medium', 1, 3, 'active', NOW()),
(404, 4, 'Geography', 'geography', 'high', 1, 4, 'active', NOW()),
(405, 4, 'Polity', 'polity', 'medium', 1, 5, 'active', NOW()),
(406, 4, 'Current Affairs', 'current-affairs', 'high', 1, 6, 'active', NOW()),
(407, 4, 'General Science', 'general-science', 'medium', 1, 7, 'active', NOW());

-- 10. Official Sample Questions for Rajasthan Informatics Assistant

-- Q1: Computer & IT (DBMS)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (1, 1, 106, 'Which normal form is based on the concept of "Full Functional Dependency"?', 'single_choice', 'medium', 'approved', 'Second Normal Form (2NF) requires that the relation must be in 1NF and no non-prime attribute is partially dependent on any candidate key of a table (i.e. Full Functional Dependency).', 1.00, 0.25, 'en', 'Rajasthan IA Previous Paper', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(1, 'A', 'First Normal Form (1NF)', 0, 1),
(1, 'B', 'Second Normal Form (2NF)', 1, 2),
(1, 'C', 'Third Normal Form (3NF)', 0, 3),
(1, 'D', 'Boyce-Codd Normal Form (BCNF)', 0, 4);

-- Q2: Computer & IT (Networking)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (2, 1, 104, 'IPv4 address ka size kitna hota hai?', 'single_choice', 'easy', 'approved', 'IPv4 address 32 bits (4 bytes) ka hota hai, jabki IPv6 address 128 bits ka hota hai.', 1.00, 0.25, 'hi', 'RSMSSB Standard IT Bank', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(2, 'A', '16 bits', 0, 1),
(2, 'B', '32 bits', 1, 2),
(2, 'C', '64 bits', 0, 3),
(2, 'D', '128 bits', 0, 4);

-- Q3: Reasoning (Blood Relation)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (3, 2, 201, 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?', 'single_choice', 'easy', 'approved', 'The only son of Suresh\'s mother is Suresh himself. Therefore, the boy in the photograph is Suresh\'s son, which makes Suresh his Father.', 1.00, 0.25, 'en', 'Mental Ability Standard Bank', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(3, 'A', 'Brother', 0, 1),
(3, 'B', 'Uncle', 0, 2),
(3, 'C', 'Father', 1, 3),
(3, 'D', 'Grandfather', 0, 4);

-- Q4: Reasoning (Coding-Decoding)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (4, 2, 202, 'If "COMPUTER" is coded as "RFUVQNPC", how will "MEDICINE" be coded in the same language?', 'single_choice', 'medium', 'approved', 'The first and last letters are swapped and written in reverse, with each middle letter shifted by +1. MEDICINE becomes EOJDJEFM.', 1.00, 0.25, 'en', 'Reasoning Question Bank', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(4, 'A', 'EOJDJEFM', 1, 1),
(4, 'B', 'MFEDJJOE', 0, 2),
(4, 'C', 'EOJDEJFM', 0, 3),
(4, 'D', 'MFEJDJOE', 0, 4);

-- Q5: Mathematics (Percentage)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (5, 3, 301, 'If 20% of an electricity bill is deducted, ₹100 is still to be paid. How much was the original bill amount?', 'single_choice', 'easy', 'approved', 'Remaining bill percentage = 80%. 80% of Bill = ₹100 => Total Bill = (100 * 100) / 80 = ₹125.', 1.00, 0.25, 'en', 'Quantitative Aptitude Foundation', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(5, 'A', '₹110', 0, 1),
(5, 'B', '₹120', 0, 2),
(5, 'C', '₹125', 1, 3),
(5, 'D', '₹130', 0, 4);

-- Q6: Mathematics (Profit-Loss)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (6, 3, 302, 'Ek vastu ko ₹1440 me bechne par ek vyapari ko 20% ka labh hota hai. Vastu ka kray mulya (Cost Price) kya hai?', 'single_choice', 'easy', 'approved', 'CP = (SP * 100) / (100 + Profit%) = (1440 * 100) / 120 = ₹1200.', 1.00, 0.25, 'hi', 'Maths IA Preparation', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(6, 'A', '₹1100', 0, 1),
(6, 'B', '₹1200', 1, 2),
(6, 'C', '₹1250', 0, 3),
(6, 'D', '₹1300', 0, 4);

-- Q7: General Knowledge (Rajasthan GK)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (7, 4, 401, 'राजस्थान में "हवा महल" का निर्माण किसने करवाया था?', 'single_choice', 'easy', 'approved', 'जयपुर में स्थित हवा महल का निर्माण 1799 ई. में सवाई प्रताप सिंह ने करवाया था। इसके वास्तुकार लालचंद उस्ता थे।', 1.00, 0.25, 'hi', 'Rajasthan GK Official Archive', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(7, 'A', 'सवाई जयसिंह', 0, 1),
(7, 'B', 'सवाई मानसिंह', 0, 2),
(7, 'C', 'सवाई प्रताप सिंह', 1, 3),
(7, 'D', 'राजा भारमल', 0, 4);

-- Q8: General Knowledge (Geography)
INSERT INTO questions (id, subject_id, topic_id, question_text, question_type, difficulty, status, explanation, default_marks, default_negative_marks, language_code, source, created_at)
VALUES (8, 4, 404, 'राजस्थान की कौन-सी नदी को "कामधेनु" एवं "चर्मण्वती" के नाम से भी जाना जाता है?', 'single_choice', 'easy', 'approved', 'चम्बल नदी को राजस्थान की कामधेनु और चर्मण्वती भी कहा जाता है। यह राजस्थान की बारहमासी नदी है।', 1.00, 0.25, 'hi', 'Rajasthan Geography Official Bank', NOW());

INSERT INTO question_options (question_id, option_key, option_text, is_correct, order_index) VALUES
(8, 'A', 'बनास', 0, 1),
(8, 'B', 'चम्बल', 1, 2),
(8, 'C', 'लूनी', 0, 3),
(8, 'D', 'माही', 0, 4);

-- 11. Official Assessment: Rajasthan Informatics Assistant Comprehensive Drill 01
INSERT INTO assessments (id, title, slug, description, exam_id, subject_id, topic_id, assessment_type, duration_minutes, total_questions, total_marks, passing_percentage, status, created_at)
VALUES 
(1, 'Rajasthan Informatics Assistant Official Practice Drill 01', 'rajasthan-ia-official-drill-01', 'Official practice drill covering all 4 core subjects: Computer & IT, Reasoning, Mathematics, and General Knowledge (GK).', 1, NULL, NULL, 'mock', 30, 8, 8.00, 40.00, 'published', NOW());

-- Link all 8 questions to Assessment 1
INSERT INTO assessment_questions (assessment_id, section_id, question_id, order_index, marks, negative_marks)
VALUES 
(1, NULL, 1, 1, 1.00, 0.25),
(1, NULL, 2, 2, 1.00, 0.25),
(1, NULL, 3, 3, 1.00, 0.25),
(1, NULL, 4, 4, 1.00, 0.25),
(1, NULL, 5, 5, 1.00, 0.25),
(1, NULL, 6, 6, 1.00, 0.25),
(1, NULL, 7, 7, 1.00, 0.25),
(1, NULL, 8, 8, 1.00, 0.25);
